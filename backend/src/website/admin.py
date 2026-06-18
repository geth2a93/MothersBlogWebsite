from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required
from datetime import datetime, timezone
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
    #for scheduling future posts
    date_upload = data.get("date")
    if date_upload:
        date = datetime.fromisoformat(date_upload)
    else:
        date = datetime.now(timezone.utc)

    title= data.get("title")
    if not title:
        return jsonify({"error": "No title"}), 400 
    preview = data.get("preview")
    slug = generate_unique_slug(BlogPost, title)

    #going to be a function at some point
    url_content_type = data.get("url_content_type")
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
        upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"],"blog")
        os.makedirs(upload_folder, exist_ok=True)
        filename = f"blog_{slug}_title.{ext}"
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        title_media_content_url = f"/static/uploads/blog/{filename}"

            
    else:
        return jsonify({"error": "Invalid content type"}), 400   
    
    
    try:
        blog = BlogPost(title=title, slug=slug, preview=preview, title_media_content_url=title_media_content_url, url_content_type=url_content_type, ownership=ownership, name_of_owner=name, date_created=date)
        db.session.add(blog)
        db.session.flush()
        tags = request.form.getlist("tags")
        for tag in tags:
            new_tag = Tags(content=tag, blog_id=blog.id)
            db.session.add(new_tag)

        
        try:
            content_blocks = json.loads(data.get("content_blocks", "[]"))
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid content_blocks JSON"}), 400
        for index, block in enumerate(content_blocks):
            block_url_content_type = block.get("url_content_type")
        
            if block_url_content_type is None:
                ownership_block = True
                name_block = None
                media_content_url = None

            elif block_url_content_type == "image":
                file = request.files.get(f"image_{index}")
                if not file:
                    return jsonify({"error": "Missing image file in block"}), 400
                
                ownership_block = block.get("ownership", True)
                if ownership_block:
                    name_block = None
                else:
                    name_block = block.get("name_of_owner")
                    if not name_block:
                        return jsonify({"error": "Missing owner name"}), 400
                ext = file.filename.rsplit(".", 1)[-1].lower()
                filename = f"blog_{slug}_{index}.{ext}"
                upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"],"blog")
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
            
            new_block = BlogContentBlock(blog_id=blog.id, order=block.get("order", index), title_of_block=block.get("title_of_block"), content=block.get("content"), media_content_url=media_content_url,
                url_content_type=block_url_content_type, ownership=ownership_block, name_of_owner=name_block, alignment=block.get("alignment"))
            db.session.add(new_block)
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Blog post created","blog_id": blog.id, "slug": blog.slug}), 200

def generate_unique_slug(model, text):
    base_slug = slugify(text)
    slug = base_slug
    counter = 1

    while model.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug