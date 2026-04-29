from flask import Blueprint, request, jsonify, current_app
from .models import AboutMe
from flask_login import login_required, current_user
from website.file_storage import save_file
from .functions import *

api = Blueprint('api', __name__, url_prefix="/api") 

@api.route("/", methods=["GET"])
def home():
    latest = get_home_latest_content()

    if latest:
        return jsonify({
            **latest,
            "author_image": current_app.config["AUTHOR_IMAGE_URL"]
    })

    return jsonify({"message": "No content found"}), 404

@api.route("/blog", methods=["GET"])
def blog_feed():
    page = request.args.get("page", 1, type=int)
    return jsonify(get_blog_posts(page))

@api.route("/blog/<int:id>", methods=["GET"])
def blog_post(id):
    return jsonify(get_blog_by_id(id))

@api.route("/book/<string:genre>")
def books_by_genre(genre):
    return jsonify()

@api.route("/about", methods=["GET"])
def about():
    about = AboutMe.query.first()

    return jsonify({
        "content": about.content,
        "author_image": current_app.config["AUTHOR_IMAGE_URL"]
    })
