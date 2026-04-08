from flask import Flask
from flask_cors import CORS
from os import path
from website.views import books_bp, blog_bp
from website.__init__ import db, DB_NAME
from website.models import *

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "key"
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    app.register_blueprint(books_bp)
    app.register_blueprint(blog_bp)

    CORS(app)

    return app

app = create_app()

with app.app_context():
    if not path.exists(DB_NAME):
        db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5055)
