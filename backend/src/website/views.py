from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from website.file_storage import save_file
from .functions import get_genres, get_books_by_genre, get_blog_posts

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
def test():
    return jsonify(get_blog_posts())

@views.route("/blog/uploadimage", methods=["POST"])
@login_required
def upload_image():
    file = request.files.get("image")

    url = save_file(file, subfolder="blogpics")

    if not url:
        return jsonify({"error": "No file"}), 400

    return jsonify({"image_url": url}), 200