from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from .functions import get_genres, get_books_by_genre, get_blog_posts

books_bp = Blueprint("books", __name__, url_prefix="/api/books")
blog_bp = Blueprint("blog", __name__, url_prefix="/api/blog")

@books_bp.route("/genres")
def books_genres():
    return jsonify(get_genres())

@books_bp.route("/genre/<string:genre_name>")
def books_by_genre(genre_name):
    return jsonify(get_books_by_genre(genre_name))

@blog_bp.route("/")
def home():
    return jsonify(get_blog_posts())
