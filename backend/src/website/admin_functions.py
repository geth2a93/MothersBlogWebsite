from flask import request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename
from flask_login import login_required
from datetime import datetime, timezone, timedelta
import os, json
from . import db
from .models import *
from .functions import *
from zoneinfo import ZoneInfo

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
    emails = SubscriberEmail.query.order_by(SubscriberEmail.date_to_send.desc()).all()
    today = datetime.now(ZoneInfo("America/Los_Angeles")).date()
    if emails:
        for email in emails:
            if email.date_to_send.date() == today:
                email_id = email.id
                func_send_email(email_id)

    blogs = BlogPost.query.order_by(BlogPost.date_created.desc()).all()
    if blogs:
        for blog in blogs:
            if blog.date_created.date() == today:
                slug = blog.slug
                set_blog_to_publish(slug)

    books = Book.query.order_by(Book.date_added.desc()).all()
    if books:
        for book in books:
            if book.date_added.date() == today:
                title = book.title
                set_book_to_publish(title)
    return jsonify({"message": f'success'}), 201

def func_send_email(email_id):
    p = SubscriberEmail.query.filter_by(id=email_id).first_or_404()
    try:
        subscriber_email(email_id)
        p.sent == True
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": f'Email "{p.subject}" sent'}), 201
    
def set_blog_to_publish(slug):
    p = BlogPost.query.filter_by(slug=slug).first_or_404()
    p.published = True
    db.session.commit()
    return jsonify({"message": f'Blog "{p.slug}" published'}), 201

def subscriber_email(email_id):
    return

def set_book_to_publish(title):
    p = Book.query.filter_by(title=title).first_or_404()
    p.displayed = True
    db.session.commit()
    return jsonify({"message": f'Book "{p.title}" published'}), 201