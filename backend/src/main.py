from flask import Flask, jsonify
from flask_cors import CORS
from os import path
#from website.views import books_bp, blog_bp
from website.__init__ import db, DB_NAME
from website.models import *
from website.functions import get_genres, get_books_by_genre, get_blog_posts

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "key"
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    CORS(app)

    return app

app = create_app()

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the home page"})

@app.route("/blog")
def get_blog_posts_route():
    return jsonify(get_blog_posts())

if __name__ == "__main__":
    app.run(debug=True, port=5055)