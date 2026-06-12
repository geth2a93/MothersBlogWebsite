from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required, login_user
from datetime import datetime
import os, uuid, json
from . import db
from .models import *
from .functions import *


auth = Blueprint('auth', __name__,  url_prefix="/auth")

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON"}), 400
    
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Logged in"}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth.route("/admin/aboutme", methods=["GET", "PUT"])
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
        upload_folder = os.path.join("static", "uploads", "author picture")
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        about.abtme_pic_url = f"/static/uploads/{filename}"
        

    about.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "About Me updated",
        "abtme_pic_url": build_url(about.abtme_pic_url)
    }), 200

@auth.route("/admin/websiteresources", methods=["GET", "PUT"])
@login_required
def edit_site_resources():
    resources = Website_Images.query.first()

    if request.method == "GET":
        return jsonify({
            "logo_image": build_url(resources.logo_image_url),
            "banner_image": build_url(resources.banner_image_url)
        })
  
    image_type = request.form.get("image_type")
    file = request.files.get("image")

    if not file or file.filename == "":
        return jsonify({"error": "No image uploaded"}), 400

    upload_folder = os.path.join("static", "uploads", "website_resources")
    os.makedirs(upload_folder, exist_ok=True)

    #above is new linking to pathways change others *change others to this*

    #save new image
    filename = secure_filename(file.filename)

    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)
    #delete old news to be added
    new_url = f"/static/uploads/{filename}"

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