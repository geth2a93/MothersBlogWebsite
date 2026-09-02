from flask import Blueprint, send_from_directory, request, jsonify, current_app
from .models import AboutMe
from .functions import *

api = Blueprint('api', __name__, url_prefix="/api") 


#global data

@api.route("/website-settings", methods=["GET"]) 
def site_settings():
    s = Website_Images.query.first()
    return jsonify({
        "logo": build_url(s.logo_image_url) if s else None
    })


#home

@api.route("/", methods=["GET"])
def home():
    latest = get_home_latest_content()
    site_images = Website_Images.query.first()

    return jsonify({
        "latest": latest if latest else None,
        "banner_image": build_url(site_images.banner_image_url) if site_images.banner_image_url else None
    })



#blog routes

@api.route("/blog", methods=["GET"])
def blog_feed():
    page = request.args.get("page", 1, type=int)
    return jsonify(get_blog_posts(page))

@api.route("/blog/<string:slug>", methods=["GET"])
def blog_post(slug):
    return jsonify(get_blog_by_slug(slug))


#book routes
@api.route("/genres")
def get_genres():
    genres = Genre.query.order_by(Genre.genre).all()

    return jsonify([
        {
            "id": genre.id,
            "name": genre.genre,
            "display": display_genre(genre.genre)
        }
        for genre in genres
    ]), 200

@api.route("/books", methods=["GET"])
def newest_books_by_genre():
    return jsonify(get_newest_book_for_each_genre())

@api.route("/books/<string:genre>", methods=["GET"])
def books_by_genre(genre):
    return jsonify(get_books_by_genre(genre))

@api.route("/books/title/<string:slug>", methods=["GET"])
def book_by_title(slug):
    return jsonify(get_books_by_title(slug, True))


#teachingresource routes

@api.route("/teachingresources", methods=["GET"])
def teaching():
    return jsonify(get_teaching_resources())


@api.route("/teachingresources/<string:title>", methods=["GET"])
def teaching_by_title(title):
    return jsonify(get_teaching_resources_by_book(title))

@api.route("/aboutme", methods=["GET"])
def about():
    about = AboutMe.query.first()
    if about:
        return jsonify({
            "content": about.bio,
            "author_image": build_url(about.photo_url)
        })
    else:
        return jsonify({"error": "About Me not found"}), 404

@api.route("/addsub", methods=["POST"])
def add_subscriber():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Missing data"}), 400

        email = data.get("email", "").strip()
        name = data.get("name", "").strip()

        if not email:
            return jsonify({"error": "Email required"}), 400

        if len(email) > 50:
            return jsonify({"error": "Email address too long"}), 400

        if name and len(name) > 20:
            return jsonify({"error": "Name is too long"}), 400

        existing_subscriber = Subscribers.query.filter_by(email=email).first()

        if existing_subscriber:
            return jsonify({"error": "This email is already subscribed"}), 409

        subscriber = Subscribers(email=email, name=name if name else None)

        db.session.add(subscriber)
        db.session.commit()

        return jsonify({"message": "Successfully subscribed"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route("/uploads/emails/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

