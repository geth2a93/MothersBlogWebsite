from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required
from datetime import datetime, timezone, timedelta
import os, json
from . import db
from .models import *
from .functions import *
from .admin_functions import *

admin = Blueprint('admin', __name__,  url_prefix="/admin")

#@admin.route("/admin", methods=["GET", "PUT"])
#@login_required
#def adminhome():


@admin.route("/editaboutme", methods=["GET", "PUT"])
@login_required
def edit_about_me():
    about = AboutMe.query.first()

    if request.method == "GET":
        return jsonify({
            "content": about.content,
            "updated_at": about.updated_at.isoformat(),
            "abtme_pic_url": build_url(about.abtme_pic_url)
        })
  
    content = request.form.get("content")

    if content:
        about.content = content

    file = request.files.get("image")
    if file and file.filename != "":
        url, error = upload_image(file, "website_resources", file.filename)

    if error:
        return jsonify({"error": error}), 400

    about.abtme_pic_url = url

    about.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "About Me updated",
        "abtme_pic_url": build_url(about.abtme_pic_url)
    }), 200


@admin.route("/websiteresources", methods=["GET", "PUT"])
@login_required
def edit_site_resources():
    resources = Website_Images.query.first()
    
    if request.method == "GET":
        return jsonify({
            "logo_image": build_url(resources.logo_image_url),
            "banner_image": build_url(resources.banner_image_url)
        })

    image_type = request.form.get("image_type")
    file = request.files.get("image")#check size return too large if too large

    if file and file.filename != "":
        url, error = upload_image(file, "website_resources", file.filename)
    if error:
        return jsonify({"error": error}), 400

    if image_type == "logo":
        resources.logo_image_url = url
    elif image_type == "banner":
        resources.banner_image_url = url

    db.session.commit()

    return jsonify({
        "message": "Image updated",
        "image_url": build_url(url)
    }), 200


@admin.route("/newblogpost", methods=["PUT"])
@login_required
def new_blog_post():
    data = request.form    
    if not request.form and not request.files:
        return jsonify({"error": "Missing data"}), 400

    blog_id = data.get("blog_id") 

    date_upload = data.get("date")
    if date_upload:
        date = datetime.fromisoformat(date_upload)
    else:
        date = datetime.now(timezone.utc)

    title = data.get("title")
    if not title:
        return jsonify({"error": "No title"}), 400

    preview = data.get("preview")

    title_url_content_type = data.get("title_url_content_type")

    if blog_id:
        blog = BlogPost.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404
        title_media_content_url = blog.title_media_content_url
    else:
        slug = generate_unique_slug(BlogPost, title)
        blog = BlogPost()
        blog.title = title
        blog.slug = slug
        db.session.add(blog)
        db.session.flush()

    if title_url_content_type == "none":
        ownership = True
        name = None
        title_media_content_url = None

    elif title_url_content_type in {"youtube", "instagram", "facebook", "threads"}:
        ownership = True
        name = None
        title_media_content_url = data.get("title_media_content_url")

        if not title_media_content_url:
            return jsonify({"error": "Url Empty"}), 400
        if not url_check(title_media_content_url, title_url_content_type):
                return jsonify({"error": "Type Mismatch between selected value and link value"}), 400

    elif title_url_content_type == "image":
        file = request.files.get("title_image")
        parse_ownership(file)
        if file and file.filename != "":
            title_media_content_url, error = upload_image(file, "website_resources", file.filename)
            if error:
                return jsonify({"error": error}), 400

    else:
        return jsonify({"error": "Invalid content type"}), 400

    blog.title = title
    blog.preview = preview
    blog.title_media_content_url = title_media_content_url
    blog.url_content_type = title_url_content_type
    blog.ownership = ownership
    blog.name_of_owner = name
    blog.date_created = date
    blog.published = False

    Tags.query.filter_by(blog_id=blog.id).delete()

    tags = request.form.getlist("tags")
    for tag in tags:
        db.session.add(Tags(content=tag, blog_id=blog.id))

    BlogContentBlock.query.filter_by(blog_id=blog.id).delete()

    try:
        content_blocks = json.loads(data.get("content_blocks", "[]"))
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid content_blocks JSON"}), 400

    for index, block in enumerate(content_blocks):

        block_url_content_type = block.get("url_content_type")

        if block_url_content_type == "none":
            ownership_block = True
            name_block = None
            media_content_url = None

        elif block_url_content_type == "image":
            file = request.files.get(f"image_{index}")
            if not file and not block.media_content_url:
                return jsonify({"error": "Missing image file in block"}), 400

            ownership_block = block.get("ownership", "true").lower() == "true"

            if ownership_block:
                name_block = None
            else:
                name_block = block.get("name_of_owner")
                if not name_block:
                    return jsonify({"error": "Missing owner name"}), 400
            if file:
                ext = file.filename.rsplit(".", 1)[-1].lower()
                if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                    return jsonify({"error": "Invalid image type"}), 400
                filename = f"blog_{blog.slug}_{index}.{ext}"
                upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "blog")
                os.makedirs(upload_folder, exist_ok=True)

                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)

                media_content_url = f"/static/uploads/blog/{filename}"

        elif block_url_content_type in {"youtube", "instagram", "facebook", "threads"}:
            ownership_block = True
            name_block = None
            media_content_url = block.get("media_content_url")

            if not media_content_url:
                return jsonify({"error": "Missing block URL"}), 400
            if not url_check(media_content_url, block_url_content_type):
                return jsonify({"error": "Type Mismatch between selected value and link value"}), 400

        else:
            return jsonify({"error": "Invalid block content type"}), 400

        title_of_block = block.get("title_of_block")
        content = block.get("content")

        if not any([title_of_block, content, media_content_url]):
            return jsonify({"error": "Block cannot be empty"}), 400

        new_block = BlogContentBlock(blog_id=blog.id, order=block.get("order", index), title_of_block=title_of_block, content=content, media_content_url=media_content_url,
            url_content_type=block_url_content_type, ownership=ownership_block, name_of_owner=name_block, alignment=block.get("alignment"))

        db.session.add(new_block)

    db.session.commit()

    return jsonify({"message": "Blog post saved", "blog_id": blog.id, "slug": blog.slug,}), 200 

@admin.route("/newblogpostpreview/<string:slug>", methods=["POST"])
@login_required
def new_blog_post_preview(slug):
    p = BlogPost.query.filter_by(slug=slug).first_or_404()
    p.published = True
    db.session.commit()

    return jsonify({"message": "Blog post published", "blog_id": p.id, "slug": p.slug,})

@admin.route("/displayallblogs", methods=["GET"])
@login_required
def show_all_blogs():
    blogs = BlogPost.query.order_by(BlogPost.date_created.desc()).all()

    return jsonify({
        "blogs": [
            {
                "id": blog.id,
                "title": blog.title,
                "slug": blog.slug,
                "date_created": blog.date_created,
                "published": blog.published
            }
            for blog in blogs
        ]
    })

@admin.route("/deleteblog/<string:slug>", methods=["GET"])
@login_required
def delete_blog(slug):
    blog = BlogPost.query.filter_by(slug=slug).first_or_404()
    Tags.query.filter_by(blog_id=blog.id).delete()
    BlogContentBlock.query.filter_by(blog_id=blog.id).delete()
    db.session.delete(blog)
    db.session.commit()
    return jsonify({"message": "Blog deleted"}), 200

@admin.route("/editblog/<string:slug>", methods=["GET", "PUT"])
@login_required
def edit_blog(slug):
    blog = BlogPost.query.filter_by(slug=slug).first_or_404()
    blocks = (BlogContentBlock.query.filter_by(blog_id=blog.id).order_by(BlogContentBlock.order.asc()).all())
    title_media_content_url = blog.title_media_content_url

    if request.method == "GET":
        return jsonify(get_blog_by_slug(slug))

    data = request.form
    if not request.form and not request.files:
        return jsonify({"error": "Missing data"}), 400
    
    title = data.get("title")
    if not title:
        return jsonify({"error": "No title"}), 400

    blog.title = title
    blog.preview = data.get("preview", blog.preview)

    date = datetime.fromisoformat(data.get("date")).replace(tzinfo=timezone.utc)

    if date > datetime.now(timezone.utc):
        blog.published = False
    else:
        blog.published = data.get("published", blog.published)

    blog.date_created = date


    title_url_content_type = data.get("title_url_content_type", blog.url_content_type)

    if title_url_content_type == "none":
        blog.ownership = True
        blog.name_of_owner = None
        blog.title_media_content_url = None

    elif title_url_content_type in {"youtube", "instagram", "facebook", "threads"}:
        blog.ownership = True
        blog.name_of_owner = None
        title_media_content_url = data.get("title_media_content_url")
        if not title_media_content_url:
            return jsonify({"error": "Url Empty for title media"}), 400
        if not url_check(title_media_content_url, title_url_content_type):
            return jsonify({"error": "Type mismatch between selected value and link value for title media"}), 400
        blog.title_media_content_url = title_media_content_url

    elif title_url_content_type == "image":
        file = request.files.get("title_image")
        if not blog.title_media_content_url and not file:
            return jsonify({"error": "Missing image file for title picture"}), 400

        ownership = data.get("ownership", "true").lower() == "true"

        if ownership:
            blog.name_of_owner = None
            blog.ownership = True
        else:
            name = data.get("name_of_owner")
            if not name:
                return jsonify({"error": "Missing owner name"}), 400
            blog.ownership = False
            blog.name_of_owner = name
        if file:
            ext = file.filename.rsplit(".", 1)[-1].lower()
            if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                return jsonify({"error": "Invalid image type"}), 400
            upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "blog")
            os.makedirs(upload_folder, exist_ok=True)

            filename = f"blog_{blog.slug}_title.{ext}"
            filepath = os.path.join(upload_folder, filename)

            file.save(filepath)
            title_media_content_url = f"/static/uploads/blog/{filename}"
            blog.title_media_content_url = title_media_content_url

    else:
        return jsonify({"error": "Invalid content type for title media"}), 400

    blog.url_content_type = title_url_content_type

    blog.slug = generate_unique_slug(BlogPost, title)

    Tags.query.filter_by(blog_id=blog.id).delete()

    tags = request.form.getlist("tags")
    for tag in tags:
        db.session.add(Tags(content=tag, blog_id=blog.id))

    BlogContentBlock.query.filter_by(blog_id=blog.id).delete()

    try:
        content_blocks = json.loads(data.get("content_blocks", "[]"))
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid content_blocks JSON"}), 400
    
    for index, block in enumerate(content_blocks):
        if index < len(blocks):
            if blocks[index]:
                url = blocks[index].media_content_url
        block_url_content_type = block.get("url_content_type")
        media_url = block.get("media_content_url")
        if block_url_content_type == "none":
            ownership_block = True
            name_block = None
            url = None

        elif block_url_content_type == "image":
            file = request.files.get(f"image_{index}")
            if not file and not url and not media_url:
                return jsonify({"error": f"Missing image file in block {index+1}"}), 400
            if media_url:
                url = media_url
                url = "/static/" + url.split("/static/", 1)[1]
            ownership_block = block.get("ownership", "true").lower() == "true"

            if ownership_block:
                name_block = None
            else:
                name_block = block.get("name_of_owner")
                if not name_block:
                    return jsonify({"error": f"Missing owner name for block {index +1}"}), 400
            if file:
                ext = file.filename.rsplit(".", 1)[-1].lower()
                if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                    return jsonify({"error": "Invalid image type"}), 400
                filename = f"blog_{blog.slug}_{index}.{ext}"
                upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "blog")
                os.makedirs(upload_folder, exist_ok=True)

                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)

                url = f"/static/uploads/blog/{filename}"

        elif block_url_content_type in {"youtube", "instagram", "facebook", "threads"}:
            ownership_block = True
            name_block = None
            url = block.get("media_content_url")

            if not url:
                return jsonify({"error": f"Missing block URL{index +1}"}), 400
            if not url_check(url, block_url_content_type):
                return jsonify({"error": f"Type Mismatch between selected value and link value for block {index + 1}"}), 400

        else:
            return jsonify({"error": "Invalid block content type"}), 400

        title_of_block = block.get("title_of_block")
        content = block.get("content")

        if not any([title_of_block, content, url]):
            return jsonify({"error": f"Block cannot be empty {index + 1}"}), 400
        db.session.add(
            BlogContentBlock(
                blog_id=blog.id,
                order=block.get("order", index),
                title_of_block=title_of_block,
                content=content,
                media_content_url=url,
                url_content_type=block_url_content_type,
                ownership=ownership_block,
                name_of_owner=name_block,
                alignment=block.get("alignment")
            )
        )

    db.session.commit()

    return jsonify({"message": "Success"}), 200

#large block for pictures needs to be moved to functions and standardized, same with adding the data - should mnake 3 functions out of methods

@admin.route("/editbook/<string:title>", methods=["GET", "PUT"])
@login_required
def edit_book(title):
    spaced_title = title.replace("-", " ")
    book= Book.query.filter_by(title=spaced_title).first_or_404()


    if request.method == "GET":
        return jsonify(get_books_by_title(title))


    try:
        data = request.form
        if not request.form and not request.files:
            return jsonify({"error": "Missing data"}), 400
    
        book_title = data.get("title")
        if not book_title:
            return jsonify({"error": "No title"}), 400
    
        book.title = book_title
        book.synopsis = data.get("synopsis", book.synopsis)
    
        isbn = data.get("isbn", "").strip()
        if isbn and len(isbn.replace("-", "")) not in (10,13):
            return jsonify({"error": "Invalid ISBN length"}),400
    
        if isbn and not all(c.isdigit() or c == "-" for c in isbn):
            return jsonify({"error": "Invalid Isbn contains restricted chars"}), 400
    
        book.isbn = isbn if isbn else book.isbn


        date = data.get("date")
        if date:
            book.date_added = datetime.fromisoformat(date)

        book.genres.clear()
        genres = request.form.getlist("Genres")

        for genre_name in genres:
            genre = Genre.query.filter_by(genre=genre_name).first()

            if genre is None:
                genre = Genre(genre=genre_name)
                db.session.add(genre)
                db.session.flush()

            book.genres.append(genre)

        try:
            buy_links = json.loads(request.form.get("buy_links", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid buy links data"}),400
    
        BuyLinks.query.filter_by(book_id=book.id).delete()
    
        for link in buy_links:
            if not link.get("links_url") or not link.get("name_of_site"):
                return jsonify({"error":"Invalid buy link"}),400
            db.session.add(BuyLinks(links_url=link["links_url"], name_of_site=link["name_of_site"],book_id=book.id ))

    
        try:
            reviews = json.loads(request.form.get("reviews", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid reviews data"}),400
    
        Reviews.query.filter_by(book_id=book.id).delete()

        for review in reviews: 
            rating=int(review["rating"]) if review.get("rating") else None #note must be set to null, 1,2,3,4,5 on frontend
            db.session.add(Reviews(link_url=review.get("link_url"), name=review.get("name"), title=review.get("title"), content=review.get("content"), rating=rating, book_id=book.id))
    
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "books", "covers")
        os.makedirs(upload_folder, exist_ok=True)
        file = request.files.get("cover_image")

        if file:
            ext = file.filename.rsplit(".", 1)[-1].lower()
            if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                return jsonify({"error": "Invalid image type"}), 400
            safe_title = "".join(c for c in book.title if c.isalnum() or c in "-_")
            filename = f"book_{book.id}_{safe_title}.{ext}"

            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)
            cover_pic_url = f"/static/uploads/books/covers/{filename}"
            book.book_image_url = cover_pic_url


        try:
            awards = json.loads(request.form.get("awards", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid awards data"}),400

        Awards.query.filter_by(book_id=book.id).delete()
    
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "books", "awards")
        os.makedirs(upload_folder, exist_ok=True)

        for index, award in enumerate(awards):

            award_title = award.get("title")
            pic_url = award.get("pic_of_award")
            if pic_url:
                pic_url = "/static/" + pic_url.split("/static/", 1)[1]
            file = request.files.get(f"award_image_{index}")
            #delete
            if file:
                ext = file.filename.rsplit(".", 1)[-1].lower()
                if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                    return jsonify({"error": "Invalid image type"}), 400
                filename = f"book_{book.id}_award_{index}.{ext}"
                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)
                pic_url = f"/static/uploads/books/awards/{filename}"

            db.session.add(Awards(title=award_title,  pic_of_award=pic_url, book_id=book.id))

        db.session.commit()

        return jsonify({"message": "Success"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@admin.route("/displayallbooks", methods=["GET"])
@login_required
def show_all_books():
    books = Book.query.order_by(Book.date_added.desc()).all()

    return jsonify({
        "books": [
            {
                "id": book.id,
                "title": book.title,
                "isbn": book.isbn,
                "date_added": book.date_added,
                "genres": [g.genre for g in book.genres]
            }
            for book in books
        ]
    })

@admin.route("/deletebook/<string:title>", methods=["GET"])
@login_required
def delete_book(title):
    spaced_title = title.replace("-", " ")
    book = Book.query.filter_by(title=spaced_title).first_or_404()
    genres = list(book.genres)

    BuyLinks.query.filter_by(book_id=book.id).delete()
    Reviews.query.filter_by(book_id=book.id).delete()
    Awards.query.filter_by(book_id=book.id).delete()
    book.genres.clear()

    db.session.delete(book)
    db.session.flush()

    for genre in genres:
        if not genre.books:
            db.session.delete(genre)

    db.session.commit()

    return jsonify({"message": "Book deleted"}), 200

@admin.route("/newbook", methods=["PUT"])
@login_required
def add_book():
    try:
        data = request.form
        if not request.form and not request.files:
            return jsonify({"error": "Missing data"}), 400
        book = Book()

    
        book_title = data.get("title")
        if Book.query.filter_by(title=book_title).first():
            return jsonify({"error": "Book already exists"}), 400
        if not book_title:
            return jsonify({"error": "No title"}), 400
        book.title = book_title

        db.session.add(book)
        db.session.flush()

        synposis = data.get("synopsis")
        if synposis:
            book.synopsis = synposis
    
        isbn = data.get("isbn", "").strip()
        if isbn and len(isbn.replace("-", "")) not in (10,13):
            return jsonify({"error": "Invalid ISBN length"}),400
    
        if isbn and not all(c.isdigit() or c == "-" for c in isbn):
            return jsonify({"error": "Invalid Isbn contains restricted chars"}), 400
        if isbn:
            book.isbn = isbn


        date = data.get("date")
        if date:
            book.date_added = datetime.fromisoformat(date)

        seen = set()

        for genre_name in request.form.getlist("Genres"):
            genre_name = genre_name.strip()

            if not genre_name or genre_name in seen:
                continue

            seen.add(genre_name)

            genre = Genre.query.filter_by(genre=genre_name).first()

            if genre is None:
                genre = Genre(genre=genre_name)
                db.session.add(genre)

            book.genres.append(genre)
      

        try:
            buy_links = json.loads(request.form.get("buy_links", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid buy links data"}),400
    
        for link in buy_links:
            if not link.get("links_url") or not link.get("name_of_site"):
                return jsonify({"error":"Invalid buy link"}),400
            db.session.add(BuyLinks(links_url=link["links_url"], name_of_site=link["name_of_site"],book_id=book.id ))
    
        try:
            reviews = json.loads(request.form.get("reviews", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid reviews data"}),400
    

        for review in reviews: 
            rating=int(review["rating"]) if review.get("rating") else None #note must be set to null, 1,2,3,4,5 on frontend
            db.session.add(Reviews(link_url=review.get("link_url"), name=review.get("name"), title=review.get("title"), content=review.get("content"), rating=rating, book_id=book.id))
    
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "books", "covers")
        os.makedirs(upload_folder, exist_ok=True)
        file = request.files.get("cover_image")
    #delete
        if file:
            ext = file.filename.rsplit(".", 1)[-1].lower()
            if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                return jsonify({"error": "Invalid image type"}), 400
            safe_title = "".join(c for c in book.title if c.isalnum() or c in "-_")
            filename = f"book_{book.id}_{safe_title}.{ext}"

            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)
            cover_pic_url = f"/static/uploads/books/covers/{filename}"
            book.book_image_url = cover_pic_url


        try:
            awards = json.loads(request.form.get("awards", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid awards data"}),400
    
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "books", "awards")
        os.makedirs(upload_folder, exist_ok=True)

        for index, award in enumerate(awards):

            award_title = award.get("title")
            if not award_title: 
                return jsonify({"error": f"Missing title for award {index + 1}"}), 400
            pic_url = award.get("pic_of_award")
            file = request.files.get(f"award_image_{index}")

            if file: #delete
                ext = file.filename.rsplit(".", 1)[-1].lower()
                if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
                    return jsonify({"error": "Invalid image type"}), 400
                filename = f"book_{book.id}_award_{index}.{ext}"
                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)
                pic_url = f"/static/uploads/books/awards/{filename}"

            db.session.add(Awards(title=award_title,  pic_of_award=pic_url, book_id=book.id))

        db.session.commit()

        return jsonify({"message": f'Book "{book.title}" added'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/displayallemail", methods=["GET"])
@login_required
def display_all_emails():
    try:
        emails = (SubscriberEmail.query.order_by(SubscriberEmail.created_at.desc()).all()) #if date to send has no date
        return jsonify([
            {
                "id": email.id,
                "subject": email.subject,
                "message": email.message,
                "created_at": email.created_at.isoformat(),
                "images": [{"id": pic.id, "image_url": pic.image_url} for pic in email.email_pics]
            }
            for email in emails
        ]), 200

    except Exception as e:
            return jsonify({"error": str(e)}), 400

@admin.route("/newemail", methods=["PUT"])
@login_required
def create_email():
    try:
        data = request.form
        if not request.form and not request.files:
            return jsonify({"error": "Missing data"}), 400

        subject = data.get("subject")
        if not subject:
            return jsonify({"error": "Email subject is required"}), 400
        message = data.get("message")
        if not message:
            return jsonify({"error": "Email message is required"}), 400

        email = SubscriberEmail(subject=subject, message=message)

        db.session.add(email)
        db.session.flush()

        images = request.files.getlist("images")

        for index, image in enumerate(images):
            if not image or image.filename == "":
                continue

            ext = image.filename.rsplit(".", 1)[-1].lower()
            filename = f"email_{email.id}_{index}.{ext}"
            image_url, error = upload_image(image,"emails" ,filename)

            if error:
                db.session.rollback()
                return jsonify({"error": error}), 400

            email_pic = EmailPics(image_url=image_url, email_id=email.id)
            db.session.add(email_pic)

        db.session.commit()
        return jsonify({"message": f'Email "{email.subject}" created'}), 201

    except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

@admin.route("/editemail/<int:email_id>", methods=["GET", "PUT"])
@login_required
def edit_email(email_id):
    email = SubscriberEmail.query.get_or_404(email_id)

    if request.method == "GET":
        return jsonify({
            "id": email.id,
            "subject": email.subject,
            "message": email.message,
            "created_at": email.created_at.isoformat(),
            "images": [{"id": pic.id, "image_url": pic.image_url} for pic in email.email_pics]
        }), 200

    try:
        data = request.form

        subject = data.get("subject", "").strip()
        if not subject:
                    return jsonify({"error": "Email subject is required"}), 400
        
        message = data.get("message", "").strip()
        if not message:
            return jsonify({"error": "Email message is required"}), 400

        email.subject = subject
        email.message = message

        EmailPics.query.filter_by(email_id=email.id).delete()
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "emails")
        os.makedirs(upload_folder, exist_ok=True)
        images = request.form.get("images", "[]")

        try:
            images = json.loads(images)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid images data"}), 400

        for index, image in enumerate(images): #look at this
            image_url = image.get("image_url")
            file = request.files.get(f"image_{index}")
            if file:
                image_url = upload_image(image,"emails", image_url)
 
            elif image_url:
                if "/static/" in image_url:
                    image_url = "/static/" + image_url.split("/static/", 1)[1]
            if image_url:
                db.session.add(EmailPics(image_url=image_url, email_id=email.id))

        db.session.commit()
        return jsonify({"message": f'Email "{email.subject}" editted'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/deleteemail/<int:email_id>", methods=["GET", "PUT"])
@login_required
def delete_email(email_id):
    email = SubscriberEmail.query.get_or_404(email_id)
    try:
        EmailPics.query.filter_by(email_id=email.id).delete()
        db.session.delete(email)
        db.session.commit()
        return jsonify({"message": f'Email "{email_id}" deleted'}), 201
                
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/sendemail/<int:email_id>", methods=["POST"])
@login_required
def send_email(email_id):
    email = SubscriberEmail.query.get_or_404(email_id)
    try:
        subscribers = Subscribers.query.all()

        if not subscribers:
            return jsonify({"error": "Issue with subs"}), 400
        if email.date_to_send:
            return jsonify({"error": "Email already sent"}), 400

        #email code wont work without imports and some other changes which im not sending or uploading because they current;y cause python runtime errors so its removed so you can test

        return jsonify({"message": f'Email "{email_id}" sent'}), 201

    except Exception as e:
            return jsonify({"error": str(e)}), 400