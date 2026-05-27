from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required
from datetime import datetime
import os, uuid
from . import db
from .models import *

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
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
            "abtme_pic_url": about.abtme_pic_url
        })
  
    content = request.form.get("content")

    if content:
        about.content = content

    file = request.files.get("image")

    if file and file.filename != "":

        filename = secure_filename(file.filename)
        upload_folder = os.path.join("website", "static", "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        about.abtme_pic_url = f"uploads/{filename}"

    about.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "About Me updated",
        "abtme_pic_url": about.abtme_pic_url
    }), 200

@auth.route("/admin/websiteresources", methods=["GET", "PUT"])
@login_required
def edit_site_resources():
    resources = Website_Images.query.first()

    if request.method == "GET":
        return jsonify({
            "logo_image": resources.logo_image_url,
            "banner_image": resources.banner_image_url
        })
  
    image_type = request.form.get("image_type")
    file = request.files.get("image")

    if not file or file.filename == "":
        return jsonify({"error": "No image uploaded"}), 400

    upload_folder = os.path.join("website", "static", "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    #delete old image
    old_path = None

    if image_type == "logo":
        old_path = resources.logo_image_url

    elif image_type == "banner":
        old_path = resources.banner_image_url

    if old_path:
        full_old_path = os.path.join(
            "website",
            "static",
            old_path.replace("static/", "")
        )

        if os.path.exists(full_old_path):
            os.remove(full_old_path)

    #save new image
    filename = secure_filename(file.filename)

    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    new_url = f"/static/uploads/{filename}"

    #update db
    if image_type == "logo":
        resources.logo_image_url = new_url

    elif image_type == "banner":
        resources.banner_image_url = new_url

    db.session.commit()

    return jsonify({
        "message": "Image updated",
        "image_url": new_url
    }), 200