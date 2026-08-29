from flask import request, jsonify, Blueprint, current_app
from zoneinfo import ZoneInfo
from flask_login import login_required
from datetime import datetime
import os, json
from . import db
from .models import *
from .functions import *
from .admin_functions import *

admin = Blueprint('admin', __name__,  url_prefix="/admin")

#Later Edits
#large block for pictures needs to be moved to functions and standardized, same with adding the data - should mnake 3 functions out of methods - 2 done ownership/uploadimage
#next to remove is the if image elif social, etc section into seperate function
# last would be anything duplicated, like a large amount of the add book and edit is shared
#

@admin.route("/editaboutme", methods=["GET", "PUT"])
@login_required
def edit_about_me():
    about = AboutMe.query.first()
    try:
        if not about:
            about = AboutMe()
            db.session.add(about)

        if request.method == "GET":
            return jsonify({
                "content": about.bio,
                "updated_at": about.updated_at.isoformat(),
                "abtme_pic_url": build_url(about.photo_url)
            })
  
        content = request.form.get("content")

        if content:
            about.bio = content

        file = request.files.get("image")
        if file and file.filename != "":
            url, error = upload_image(file, "website_resources", file.filename)
            if error:
                return jsonify({"error": error}), 400
            about.photo_url = url

        about.updated_at = datetime.now(ZoneInfo("America/New_York"))
        db.session.commit()

        return jsonify({
            "message": "About Me updated",
            "abtme_pic_url": build_url(about.photo_url)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/websiteresources", methods=["GET", "PUT"])
@login_required
def edit_site_resources():
    resources = Website_Images.query.first()
    try:
        if not resources:
            resources = Website_Images()
            db.session.add(resources)
        if request.method == "GET":
            return jsonify({
                "logo_image": build_url(resources.logo_image_url),
                "banner_image": build_url(resources.banner_image_url)
            })

        image_type = request.form.get("image_type")
        file = request.files.get("image")

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
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

#Blogs

@admin.route("/displayallblogs", methods=["GET"])
@login_required
def show_all_blogs():
    blogs = BlogPost.query.order_by(BlogPost.blog_date.desc()).all()

    return jsonify({
        "blogs": [
            {
                "id": blog.id,
                "title": blog.title,
                "slug": blog.slug,
                "date_created": blog.blog_date,
                "published": blog.published
            }
            for blog in blogs
        ]
    })

@admin.route("/deleteblog/<string:slug>", methods=["GET"])
@login_required
def delete_blog(slug):
    blog = BlogPost.query.filter_by(slug=slug).first_or_404()
    try:
        Tags.query.filter_by(blog_id=blog.id).delete()
        BlogContentBlock.query.filter_by(blog_id=blog.id).delete()
        db.session.delete(blog)
        db.session.commit()

        return jsonify({"message": "Blog deleted"}), 200
    
    except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

@admin.route("/publishblog/<string:slug>", methods=["POST"])
@login_required
def blog_post_publish(slug):
    p = BlogPost.query.filter_by(slug=slug).first_or_404()
    try:
        p.blog_date = datetime.now(ZoneInfo("America/New_York"))
        p.published = True
        db.session.commit()

        return jsonify({"message": "Blog post published", "blog_id": p.id, "slug": p.slug,})
    
    except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

@admin.route("/newblogpost", methods=["PUT"])
@login_required
def new_blog_post():
    try:
        data = request.form    
        if not request.form and not request.files:
            return jsonify({"error": "Missing data"}), 400

        blog_id = data.get("blog_id") 

        date_upload = data.get("date")
        if date_upload:
            date = datetime.fromisoformat(date_upload)
        else:
            date = datetime.now(ZoneInfo("America/New_York"))

        title = data.get("title")
        if not title:
            return jsonify({"error": "No title"}), 400

        title_text_content = data.get("preview")
        title_media_content_type = data.get("title_url_content_type")

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

        if title_media_content_type == "none":
            title_media_ownership = True
            title_media_owner_name = None
            title_media_content_url = None

        elif title_media_content_type in {"youtube", "instagram", "facebook", "threads"}:
            title_media_ownership = True
            title_media_owner_name = None
            title_media_content_url = data.get("title_media_content_url")

            if not title_media_content_url:
                return jsonify({"error": "Url Empty"}), 400
            if not url_check(title_media_content_url, title_media_content_type):
                return jsonify({"error": "Type Mismatch between selected value and link value"}), 400

        elif title_media_content_type == "image":
            file = request.files.get("title_image")
            title_media_ownership, title_media_owner_name, ownership_error = parse_ownership(data)
            if ownership_error:
                return jsonify({"error": ownership_error}), 400
            if file and file.filename != "":
                title_media_content_url, error = upload_image(file, "website_resources", file.filename)
                if error:
                    return jsonify({"error": error}), 400

        else:
            return jsonify({"error": "Invalid content type"}), 400

        blog.title = title
        blog.title_text_content = title_text_content
        blog.title_media_content_url = title_media_content_url
        blog.title_media_content_type = title_media_content_type
        blog.title_media_ownership = title_media_ownership
        blog.title_media_owner_name = title_media_owner_name
        blog.blog_date = date
        blog.published = False

        Tags.query.filter_by(blog_id=blog.id).delete()

        tags = request.form.getlist("tags")
        for tag in tags:
            db.session.add(Tags(tag=tag, blog_id=blog.id))

        BlogContentBlock.query.filter_by(blog_id=blog.id).delete()

        try:
            content_blocks = json.loads(data.get("content_blocks", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid content_blocks JSON"}), 400

        for index, block in enumerate(content_blocks):
            block_media_content_type = block.get("url_content_type")
            new_block = BlogContentBlock()
            new_block.blog_id = blog.id
            new_block.order = block.get("order", index)
            db.session.add(new_block)
            db.session.flush()

            if block_media_content_type == "none":
                block_media_ownership = True
                block_media_owner_name = None
                block_media_content_url = None

            elif block_media_content_type == "image":
                file = request.files.get(f"image_{index}")
                if not file:
                    return jsonify({"error": "Missing image file in block"}), 400
                block_media_ownership, block_media_owner_name, ownership_error = parse_ownership(block)
                if ownership_error:
                    return jsonify({"error": ownership_error}), 400

                if file and file.filename != "":
                    filename = f"blog_{blog.slug}_{new_block.id}"
                    block_media_content_url, error = upload_image(file, "blog", filename)
                    if error:
                        return jsonify({"error": error}), 400

            elif block_media_content_type in {"youtube", "instagram", "facebook", "threads"}:
                block_media_ownership = True
                block_media_owner_name = None
                block_media_content_url = block.get("media_content_url")

                if not block_media_content_url:
                    return jsonify({"error": "Missing block URL"}), 400
                if not url_check(block_media_content_url, block_media_content_type):
                    return jsonify({"error": "Type Mismatch between selected value and link value"}), 400

            else:
                return jsonify({"error": "Invalid block content type"}), 400

            title_of_block = block.get("title_of_block")
            block_text_content = block.get("content")

            if not any([title_of_block, block_text_content, block_media_content_url]):
                return jsonify({"error": "Block cannot be empty"}), 400

            new_block.title_of_block=title_of_block
            new_block.content=block_text_content
            new_block.media_content_url=block_media_content_url
            new_block.url_content_type=block_media_content_type
            new_block.ownership=block_media_ownership
            new_block.name_of_owner=block_media_owner_name
            new_block.alignment=block.get("alignment")

        db.session.commit()

        return jsonify({"message": "Blog post saved", "blog_id": blog.id, "slug": blog.slug,}), 200 

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/newblogpostpreview/<string:slug>", methods=["POST"])
@login_required
def new_blog_post_preview(slug):
    try:
        p = BlogPost.query.filter_by(slug=slug).first_or_404()
        p.published = True
        db.session.commit()

        return jsonify({"message": "Blog post published", "blog_id": p.id, "slug": p.slug,})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/editblog/<string:slug>", methods=["GET", "PUT"])
@login_required
def edit_blog(slug):
    blog = BlogPost.query.filter_by(slug=slug).first_or_404()
    try:
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
        blog.title_text_content = data.get("preview", blog.title_text_content)

        date = datetime.fromisoformat(data.get("date")).replace(tzinfo=ZoneInfo("America/New_York"))

        if date > datetime.now(ZoneInfo("America/New_York")):
            blog.published = False
        else:
            blog.published = True

        blog.blog_date = date

        title_media_content_type = data.get("title_url_content_type", blog.title_media_content_type)

        if title_media_content_type == "none":
            blog.title_media_ownership = True
            blog.title_media_owner_name = None
            blog.title_media_content_url = None

        elif title_media_content_type in {"youtube", "instagram", "facebook", "threads"}:
            blog.title_media_ownership = True
            blog.title_media_owner_name = None
            title_media_content_url = data.get("title_media_content_url")
            if not title_media_content_url:
                return jsonify({"error": "Url Empty for title media"}), 400
            if not url_check(title_media_content_url, title_media_content_type):
                return jsonify({"error": "Type mismatch between selected value and link value for title media"}), 400
            blog.title_media_content_url = title_media_content_url

        elif title_media_content_type == "image":
            file = request.files.get("title_image")
            title_media_ownership, title_media_owner_name, ownership_error = parse_ownership(data)
            if ownership_error:
                return jsonify({"error": ownership_error}), 400
            if file and file.filename != "":
                title_media_content_url, error = upload_image(file, "website_resources", file.filename)
                if error:
                    return jsonify({"error": error}), 400
                blog.title_media_content_url = title_media_content_url
                blog.ownership = title_media_ownership
                blog.name = title_media_owner_name

        else:
            return jsonify({"error": "Invalid content type for title media"}), 400

        blog.title_media_content_type = title_media_content_type
        blog.slug = generate_unique_slug(BlogPost, title)

        Tags.query.filter_by(blog_id=blog.id).delete()

        tags = request.form.getlist("tags")
        for tag in tags:
            db.session.add(Tags(tag=tag, blog_id=blog.id))

        BlogContentBlock.query.filter_by(blog_id=blog.id).delete()

        try:
            content_blocks = json.loads(data.get("content_blocks", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid content_blocks JSON"}), 400
    
        for index, block in enumerate(content_blocks):
            new_block = BlogContentBlock()
            new_block.blog_id = blog.id
            new_block.order = block.get("order", index)
            db.session.add(new_block)
            db.session.flush()
 
            block_media_content_type = block.get("url_content_type")

            if block_media_content_type == "none":
                block_media_ownership = True
                block_media_owner_name = None
                block_media_content_url = None

            elif block_media_content_type == "image":
                block_media_content_url = block.get("media_content_url")
                if block_media_content_url:
                    block_media_content_url = "/static/" + block_media_content_url.split("/static/", 1)[1]
                else:
                    file = request.files.get(f"image_{index}")
                    if not file and not block_media_content_url:
                        return jsonify({"error": f"Missing image file in block {index+1}"}), 400                
                    if file and file.filename != "":
                        filename = f"blog_{blog.slug}_{new_block.id}"
                        block_media_content_url, error = upload_image(file, "blog", filename)
                        if error: 
                            return jsonify({"error": error}), 400
                block_media_ownership, block_media_owner_name, ownership_error = parse_ownership(block)
                if ownership_error: 
                    return jsonify({ "error": f"{ownership_error} for block {index + 1}" }), 400

            elif block_media_content_type in {"youtube", "instagram", "facebook", "threads"}:
                block_media_ownership = True
                block_media_owner_name = None
                block_media_content_url = block.get("media_content_url")

                if not block_media_content_url:
                    return jsonify({"error": f"Missing block URL{index +1}"}), 400
                if not url_check(block_media_content_url, block_media_content_type):
                    return jsonify({"error": f"Type Mismatch between selected value and link value for block {index + 1}"}), 400

            else:
                return jsonify({"error": "Invalid block content type"}), 400

            title_of_block = block.get("title_of_block")
            block_text_content = block.get("content")

            if not any([title_of_block, block_text_content, block_media_content_url]):
                return jsonify({"error": f"Block cannot be empty {index + 1}"}), 400
        
            new_block.title_of_block=title_of_block
            new_block.block_text_content=block_text_content
            new_block.block_media_content_url=block_media_content_url
            new_block.block_media_content_type=block_media_content_type
            new_block.block_media_ownership=block_media_ownership
            new_block.block_media_owner_name=block_media_owner_name
            new_block.alignment=block.get("alignment")

        db.session.commit()

        return jsonify({"message": "Success"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

#Books

@admin.route("/displayallbooks", methods=["GET"])
@login_required
def show_all_books():
    books = Book.query.order_by(Book.publish_date.desc()).all()

    return jsonify({
        "books": [
            {
                "id": book.id,
                "title": book.title,
                "isbn": book.isbn,
                "date_added": book.publish_date,
                "displayed": book.published,
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
    try:
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
        return jsonify({"message": f"{spaced_title} deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/publishbook/<string:title>", methods=["GET"])
@login_required
def display_book(title):
    spaced_title = title.replace("-", " ")
    book = Book.query.filter_by(title=spaced_title).first_or_404()

    try:
        book.published = True
        db.session.commit()
        return jsonify({"message": "Book now displayed"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@admin.route("/createnewbook", methods=["PUT"])
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
            book.publish_date = datetime.fromisoformat(date)

        exists = set()

        for genre_name in request.form.getlist("Genres"):
            genre_name = genre_name.strip().replace(" ", "-")

            if not genre_name or genre_name in exists:
                continue

            exists.add(genre_name)
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
            url_of_link = link.get("links_url")
            site_name = link.get("name_of_site")
            if not url_of_link or not site_name:
                return jsonify({"error":"Invalid buy link"}),400
            db.session.add(BuyLinks(url_of_link=url_of_link, site_name=site_name, book_id=book.id ))
    
        try:
            reviews = json.loads(request.form.get("reviews", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid reviews data"}),400
    
        for review in reviews: 
            rating=int(review["rating"]) if review.get("rating") else None #note must be set to null, 1,2,3,4,5 on frontend
            db.session.add(Reviews(url_of_link=review.get("link_url"), reviewer_name=review.get("name"), review_title=review.get("title"), review_content=review.get("content"), review_rating=rating, book_id=book.id))
    
        file = request.files.get("cover_image")
  
        if file and file.filename != "":
            filename = f"book_{book.id}"
            book_image_url, error = upload_image(file, "books/covers", filename) 
            if error: 
                return jsonify({"error": error}), 400

            book.book_image_url = book_image_url

        try:
            awards = json.loads(request.form.get("awards", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid awards data"}),400
    
        for index, award in enumerate(awards):
            title_of_award = award.get("title")
            if not title_of_award: 
                return jsonify({"error": f"Missing title for award {index + 1}"}), 400
            url_of_award = award.get("pic_of_award")
            file = request.files.get(f"award_image_{index}")


            if file and file.filename != "":
                filename = f"book_{book.id}_award_{index}"
                url_of_award, error = upload_image(file, "books/awards", filename ) 
                if error: 
                    return jsonify({"error": error}), 400

            db.session.add(Awards(title_of_award=title_of_award,  url_of_award=url_of_award, book_id=book.id))

        db.session.commit()
        return jsonify({"message": f'Book "{book.title}" added'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin.route("/editbook/<string:title>", methods=["GET", "PUT"])
@login_required
def edit_book(title):
    spaced_title = title.replace("-", " ")
    book= Book.query.filter_by(title=spaced_title).first_or_404()

    if request.method == "GET":
        
        book = Book.query.filter_by(title=spaced_title).first_or_404()
        data = {
                "id": book.id,
                "isbn": book.isbn,
                "title": book.title,
                "genre": [g.genre for g in book.genres],
                "synopsis": book.synopsis,
                "book_image_url": build_url(book.book_image_url),
                "buy_links": [{ "url": l.url_of_link, "name": l.site_name} for l in book.buy_links],
                "reviews": [{"link_url": r.url_of_link, "name": r.reviewer_name, "title": r.review_title, "content": r.review_content, "rating": r.review_rating} for r in book.reviews],
                "date_added": book.publish_date,
                "awards": [{"award_url": build_url(a.url_of_award), "award_title": a.title_of_award} for a in book.awards],
        }
        return jsonify(data)

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
            book.publish_date = datetime.fromisoformat(date)

        book.genres.clear()
        genres = request.form.getlist("Genres")

        for genre_name in genres:
            genre_name = genre_name.strip().replace(" ", "-")
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
            url_of_link = link.get("links_url")
            site_name = link.get("name_of_site")
            if not url_of_link or not site_name:
                return jsonify({"error":"Invalid buy link"}),400
            db.session.add(BuyLinks(url_of_link=url_of_link, site_name=site_name, book_id=book.id ))

        try:
            reviews = json.loads(request.form.get("reviews", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid reviews data"}),400
    
        Reviews.query.filter_by(book_id=book.id).delete()

        for review in reviews: 
            rating=int(review["rating"]) if review.get("rating") else None #note must be set to null, 1,2,3,4,5 on frontend
            db.session.add(Reviews(url_of_link=review.get("link_url"), reviewer_name=review.get("name"), review_title=review.get("title"), review_content=review.get("content"), review_rating=rating, book_id=book.id))
    
        file = request.files.get("cover_image")

        if file and file.filename != "":
            filename = f"book_{book.id}"
            cover_pic_url, error = upload_image( file, "books/covers", filename)
            if error: 
                return jsonify({"error": error}), 400
            book.book_image_url = cover_pic_url


        try:
            awards = json.loads(request.form.get("awards", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error":"Invalid awards data"}),400

        Awards.query.filter_by(book_id=book.id).delete()

        for index, award in enumerate(awards):
            title_of_award = award.get("title")
            url_of_award = award.get("pic_of_award")
            if url_of_award:
                url_of_award = "/static/" + url_of_award.split("/static/", 1)[1]
            file = request.files.get(f"award_image_{index}")

            if file and file.filename != "":
                filename = f"book_{book.id}_award_{index}"
                url_of_award, error = upload_image( file, "books/awards", filename ) 
                if error: 
                    return jsonify({"error": error}), 400
                
            db.session.add(Awards(title_of_award=title_of_award,  url_of_award=url_of_award, book_id=book.id))

        db.session.commit()
        return jsonify({"message": "Success"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


#Email

@admin.route("/displayallemail", methods=["GET"])
@login_required
def display_all_emails():
    try:
        emails = (SubscriberEmail.query.order_by(SubscriberEmail.date_to_send.desc()).all()) #if date to send has no date
        return jsonify([
            {
                "id": email.id,
                "subject": email.subject,
                "message": email.body,
                "sent": email.sent,
                "date_to_send": email.date_to_send.isoformat(),
                "images": [{"id": pic.id, "image_url": pic.url_of_image} for pic in email.email_pics]
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
        body = data.get("message")
        if not body:
            return jsonify({"error": "Email message is required"}), 400
        date = data.get("date")
        if not date:
            return jsonify({"error": "Email date is required"}), 400

        email = SubscriberEmail(subject=subject, body=body, date_to_send=datetime.fromisoformat(date))

        db.session.add(email)
        db.session.flush()

        images = request.files.getlist("images")

        for index, image in enumerate(images):
            if not image or image.filename == "":
                return jsonify({"error": "Email image error"}), 400

            filename = f"email_{email.id}_{index}"
            url_of_image, error = upload_image(image,"emails", filename)

            if error:
                db.session.rollback()
                return jsonify({"error": error}), 400

            email_pic = EmailPics(url_of_image=url_of_image, email_id=email.id)
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
            "message": email.body,
            "date_to_send": email.date_to_send.isoformat(),
            "images": [{"id": pic.id, "image_url": build_url(pic.url_of_image)} for pic in email.email_pics]
        }), 200

    try:
        data = request.form

        subject = data.get("subject", "").strip()
        if not subject:
            return jsonify({"error": "Email subject is required"}), 400
        
        body = data.get("message", "").strip()
        if not body:
            return jsonify({"error": "Email message is required"}), 400

        date = data.get("date")
        if not date:
            return jsonify({"error": "Email date is required"}), 400

        email.subject = subject
        email.body = body
        email.date_to_send = datetime.fromisoformat(date)

        EmailPics.query.filter_by(email_id=email.id).delete()
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "emails")
        os.makedirs(upload_folder, exist_ok=True)
        images = request.form.get("images", "[]")

        try:
            images = json.loads(images)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid images data"}), 400

        for index, image in enumerate(images):
            url_of_image = image.get("image_url")
            file = request.files.get(f"image_{index}") 
            if url_of_image:
                if "/static/" in url_of_image:
                    url_of_image = "/static/" + url_of_image.split("/static/", 1)[1]
            if file:
                filename = f"email_{email.id}_{index}"
                url_of_image, error = upload_image(file,"emails", filename)
                if error:
                    db.session.rollback()
                    return jsonify({"error": error}), 400
            
            db.session.add(EmailPics(url_of_image=url_of_image, email_id=email.id))

        db.session.commit()
        return jsonify({"message": f'Email "{email.subject}" editted'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
        if email.sent:
            return jsonify({"error": "Email already sent"}), 400
        func_send_email(email_id)
        return jsonify({"message": f'Email "{email_id}" sent'}), 201

    except Exception as e:
            return jsonify({"error": str(e)}), 400     

@admin.route("/displayallteachingresources", methods=["GET"])
@login_required
def show_all_teaching():
    resources = TeachingResource.query.order_by(TeachingResource.id.desc()).all()
    return jsonify({ "resources": [{"title": resource.book_title, "slug": resource.slug} for resource in resources]})

@admin.route("/deleteresource/<string:slug>", methods=["GET"])
@login_required
def delete_resource(slug):
    resource = TeachingResource.query.filter_by(slug=slug).first_or_404()
    TeachingResourceVideoLink.query.filter_by(resource_id=resource.id).delete()
    TeachingResourceBookLink.query.filter_by(resource_id=resource.id).delete()

    db.session.delete(resource)
    db.session.commit()

    return jsonify({"message": "Teaching resource deleted"}), 200 

@admin.route("/newteachingresource", methods=["POST"])
@login_required
def create_teaching_resource():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON"}), 400

    book_title = data.get("book_title", "").strip()

    if not book_title:
        return jsonify({"error": "Book title is required"}), 400
    slug = generate_unique_slug(TeachingResource, book_title)

    resource = TeachingResource(book_title=book_title, slug=slug, word_list=data.get("word_list"), activities=data.get("activities"), questions=data.get("questions"), 
        supplies=data.get("supplies"), objectives=data.get("objectives"), procedures=data.get("procedures"))

    db.session.add(resource)
    db.session.flush()

    videos = data.get("video_links", [])

    for video in videos:
        video_link = video.get("video_link")
        video_title = video.get("video_title")

        if not video_link or not video_title:
            return jsonify({"error": "Missing link or title"}), 400

        new_video = TeachingResourceVideoLink(resource_id=resource.id, video_link=video_link, video_title=video_title)
        db.session.add(new_video)

    books = data.get("book_links", [])

    for book in books:
        book_link = book.get("book_link")
        book_title = book.get("book_title")

        if not book_link or not book_title:
            return jsonify({"error": "Missing link or title"}), 400

        new_book = TeachingResourceBookLink(resource_id=resource.id, book_link=book_link, book_title=book_title)
        db.session.add(new_book)

    db.session.commit()

    return jsonify({"message": "Teaching resource created"}), 201

@admin.route("/editteachingresource/<string:slug>", methods=["GET", "PUT"])
@login_required
def edit_teaching_resource(slug):
    resource = TeachingResource.query.filter_by(slug=slug).first_or_404()

    if request.method == "GET":
            return jsonify({
                "title": resource.book_title, 
                "word_list": resource.word_list, 
                "activities": resource.activities,
                "questions":resource.questions, 
                "supplies":resource.supplies, 
                "objectives":resource.objectives, 
                "procedures":resource.procedures,
                "slug": resource.slug,

                "video_links": [ { "id": video.id, "video_link": video.video_link, "video_title": video.video_title } for video in resource.video_links],
                "book_links": [ { "id": book.id, "book_link": book.book_link, "book_title": book.book_title } for book in resource.book_links ]
            }), 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON"}), 400

    book_title = data.get("book_title")
    if not book_title:
        return jsonify({"error": "Empty book title"}), 400

    resource.book_title = book_title
    resource.slug = generate_unique_slug(TeachingResource, book_title)
    resource.word_list = data.get("word_list")
    resource.activities = data.get("activities")
    resource.questions = data.get("questions")
    resource.supplies = data.get("supplies")
    resource.objectives = data.get("objectives")
    resource.procedures = data.get("procedures")

    db.session.flush()

    TeachingResourceVideoLink.query.filter_by(resource_id=resource.id).delete()
    videos = data.get("video_links", [])

    for video in videos:
        video_link = video.get("video_link")
        video_title = video.get("video_title")

        if not video_link or not video_title:
            return jsonify({"error": "Missing link or title"}), 400

        new_video = TeachingResourceVideoLink(resource_id=resource.id, video_link=video_link, video_title=video_title)
        db.session.add(new_video)

    TeachingResourceBookLink.query.filter_by(resource_id=resource.id).delete()
    books = data.get("book_links", [])

    for book in books:
        book_link = book.get("book_link")
        book_title = book.get("book_title")

        if not book_link or not book_title:
            return jsonify({"error": "Missing link or title"}), 400

        new_book = TeachingResourceBookLink(resource_id=resource.id, book_link=book_link, book_title=book_title)
        db.session.add(new_book)

    db.session.commit()

    return jsonify({"message": f'Teaching resource  "{resource.book_title}" edited'}), 201