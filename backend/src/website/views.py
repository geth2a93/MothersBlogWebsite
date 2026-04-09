from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from .functions import get_genres, get_books_by_genre, get_blog_posts

