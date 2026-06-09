from flask import Blueprint, request, jsonify, current_app
from .models import AboutMe
from flask_login import login_required
from .functions import *

api = Blueprint('api', __name__, url_prefix="/api") 


#global data

@api.route("/website-settings", methods=["GET"]) 
def site_settings():
    s = Website_Images.query.first()
    return jsonify({
        "logo": build_url(s.logo_image_url)
    })


#home

@api.route("/", methods=["GET"])
def home():
    latest = get_home_latest_content()

    site_images = Website_Images.query.first()

    return jsonify({
        "latest": latest,
        "banner_image": build_url(site_images.banner_image_url)
    })



#blog routes

@api.route("/blog", methods=["GET"])
def blog_feed():
    page = request.args.get("page", 1, type=int)
    return jsonify(get_blog_posts(page))

@api.route("/blog/<int:id>", methods=["GET"])
def blog_post(id):
    return jsonify(get_blog_by_id(id))



#book routes

@api.route("/books", methods=["GET"])
def newest_books_by_genre():
    return jsonify(get_newest_book_for_each_genre())

@api.route("/books/<string:genre>", methods=["GET"])
def books_by_genre(genre):
    return jsonify(get_books_by_genre(genre))

@api.route("/books/title/<string:title>", methods=["GET"])
def book_by_title(title):
    return jsonify(get_books_by_title(title))


#teachingresource routes

@api.route("/teachingresources", methods=["GET"])
def teaching():
    #return jsonify(get_teaching_resources)
    return jsonify()
#blocks

@api.route("/teachingresources/<string:title>", methods=["GET"])
def teaching_by_title(title):
    return jsonify()
    #return jsonify(get_teaching_resources_by_book(title))
#singles




@api.route("/aboutme", methods=["GET"])
def about():
    about = AboutMe.query.first()

    return jsonify({
        "content": about.content,
        "author_image": build_url(about.abtme_pic_url)
    })

