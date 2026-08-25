from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required
from datetime import datetime, timezone, timedelta
import os, json
from . import db
from .models import *
from .functions import *

def url_check(media_content_url, url_content_type):
    url = media_content_url.lower()
    valid_urls = {
        "youtube": ["youtube.com"],
        "instagram": ["instagram.com"],
        "facebook": ["facebook.com"],
        "threads": ["threads.com"],
        "x.com": ["x.com", "twitter.com"]
    }

    return any(site in url for site in valid_urls[url_content_type])

def generate_unique_slug(model, text):
    base_slug = slugify(text)
    slug = base_slug
    counter = 1

    while model.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug

def upload_image(file, folder, filename):
    ext = file.filename.rsplit(".", 1)[-1].lower()

    if ext not in current_app.config["UPLOAD_EXTENSIONS"]:
        return None, "Invalid image type"
    secfilename = secure_filename(f"{filename}.{ext}")
    upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], folder)
    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, secfilename)
    file.save(filepath)

    return f"/static/uploads/{folder}/{secfilename}", None

def parse_ownership(data):
    ownership = data.get("ownership", "true").lower() == "true"

    if ownership:
        return True, None, None
    
    name = data.get("name_of_owner")
    if not name:
        return None, None, "Missing owner name"

    return False, name, None

def scheduler():
    #2pm
    emails = SubscriberEmail.query.order_by(SubscriberEmail.date_to_send.desc()).all()
    if emails:
        for email in email:
            if email.date_to_send.date() == datetime.now(timezone.utc).date():
                email_id = email.id
                func_send_email(email_id)

    blogs = BlogPost.query.order_by(BlogPost.date_created.desc()).all()
    if blogs:
        for blog in blogs:
            if blog.date_created.date() == datetime.now(timezone.utc).date():
                slug = blog.slug
                set_blog_to_publish(slug)

def func_send_email(email_id):
    return
def set_blog_to_publish(slug):
    return