from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from website.file_storage import save_file
from .functions import get_genres, get_books, get_blog_posts

views = Blueprint('views', __name__) 

@views.route("/book/uploadcover", methods=["POST"])
@login_required
def upload_cover():
    file = request.files.get("image")

    url = save_file(file, subfolder="book")

    if not url:
        return jsonify({"error": "No file"}), 400

    return jsonify({"image_url": url}), 200

@views.route("/", methods=["GET"])
def home():
    #if book most recent 
        #return jsonify(genre, get_books(genre, 1))
    #else most recent blog post 
        #return jsonify(get_blog_posts(1))

    return jsonify(get_blog_posts(1)) # also add picture for mother as only displayed here and abt me page, for this it wouild just be jsonify(motherpicture.jpg)

@views.route("/blog/uploadimage", methods=["POST"])
@login_required
def upload_image():
    file = request.files.get("image")

    url = save_file(file, subfolder="blogpics")

    if not url:
        return jsonify({"error": "No file"}), 400

    return jsonify({"image_url": url}), 200