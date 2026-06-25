from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required
from datetime import datetime, timezone, timedelta
import os, json
from . import db
from .models import *
from .functions import *

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
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"],"website_resources")
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        about.abtme_pic_url = f"/static/uploads/website_resources/{filename}"

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

    if not file or file.filename == "": #breakable?
        return jsonify({"error": "No image uploaded"}), 400 

    #more error checking need
    filename = secure_filename(file.filename)
    upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"],"website_resources")
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    new_url = f"/static/uploads/website_resources/{filename}"
    #maybe add removal options for it 
    #check box, remove previous banner or logo?

    #update db
    if image_type == "logo":
        resources.logo_image_url = new_url

    elif image_type == "banner":
        resources.banner_image_url = new_url

    db.session.commit()

    return jsonify({
        "message": "Image updated",
        "image_url": build_url(new_url)
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

    url_content_type = data.get("url_content_type")

    if blog_id:
        blog = BlogPost.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404
    else:
        slug = generate_unique_slug(BlogPost, title)
        blog = BlogPost()
        blog.title = title
        blog.slug = slug
        db.session.add(blog)
        db.session.flush()

    if url_content_type == "None":
        ownership = True
        name = None
        title_media_content_url = None

    elif url_content_type in {"youtube", "instagram", "facebook", "threads"}:
        ownership = True
        name = None
        title_media_content_url = data.get("title_media_content_url")
        if not title_media_content_url:
            return jsonify({"error": "Url Empty"}), 400

    elif url_content_type == "image":
        file = request.files.get("title_image")
        if not file:
            return jsonify({"error": "Missing image file"}), 400

        ownership = data.get("ownership", "true").lower() == "true"

        if ownership:
            name = None
        else:
            name = data.get("name_of_owner")
            if not name:
                return jsonify({"error": "Missing owner name"}), 400

        ext = file.filename.rsplit(".", 1)[-1].lower()
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "blog")
        os.makedirs(upload_folder, exist_ok=True)

        filename = f"blog_{blog.slug}_title.{ext}"
        filepath = os.path.join(upload_folder, filename)

        file.save(filepath)
        title_media_content_url = f"/static/uploads/blog/{filename}"

    else:
        return jsonify({"error": "Invalid content type"}), 400

    blog.title = title
    blog.preview = preview
    blog.title_media_content_url = title_media_content_url
    blog.url_content_type = url_content_type
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

        if block_url_content_type == "None":
            ownership_block = True
            name_block = None
            media_content_url = None

        elif block_url_content_type == "image":
            file = request.files.get(f"image_{index}")
            if not file:
                return jsonify({"error": "Missing image file in block"}), 400

            ownership_block = block.get("ownership", "true").lower() == "true"

            if ownership_block:
                name_block = None
            else:
                name_block = block.get("name_of_owner")
                if not name_block:
                    return jsonify({"error": "Missing owner name"}), 400

            ext = file.filename.rsplit(".", 1)[-1].lower()

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

def generate_unique_slug(model, text):
    base_slug = slugify(text)
    slug = base_slug
    counter = 1

    while model.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug

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

@admin.route("/editblog/<string:slug>", methods=["GET", "PUT"])
@login_required
def edit_blog(slug):
    blog = BlogPost.query.filter_by(slug=slug).first_or_404()

    if request.method == "GET":
        return jsonify(get_blog_by_slug(slug))

    data = request.get_json()

    blog.title = data.get("title", blog.title)
    blog.preview = data.get("preview", blog.preview)
    blog.title_media_content_url = data.get("title_media_content_url", blog.title_media_content_url)
    blog.url_content_type = data.get("url_content_type", blog.url_content_type)
    blog.ownership = data.get("ownership", blog.ownership)
    blog.name_of_owner = data.get("name_of_owner", blog.name_of_owner)
    blog.published = data.get("published", blog.published)

    Tags.query.filter_by(blog_id=blog.id).delete()

    for tag_content in data.get("tags", []):
        db.session.add(Tags(content=tag_content, blog_id=blog.id))

    BlogContentBlock.query.filter_by(blog_id=blog.id).delete()

    for index, block in enumerate(data.get("content_blocks", [])):
        db.session.add(
            BlogContentBlock(
                blog_id=blog.id,
                order=block.get("order", index),
                title_of_block=block.get("title_of_block"),
                content=block.get("content"),
                media_content_url=block.get("media_content_url"),
                url_content_type=block.get("url_content_type"),
                ownership=block.get("ownership"),
                name_of_owner=block.get("name_of_owner"),
                alignment=block.get("alignment")
            )
        )

    db.session.commit()

    return jsonify({"message": "Success"}), 200