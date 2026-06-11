from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from os import path

db = SQLAlchemy()


def create_app():

    app = Flask(__name__)
    app.config['SECRET_KEY'] = "key"
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///books.db"

    app.config["UPLOAD_FOLDER"] = os.path.join("website", "static", "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024
    app.config["ALLOWED_EXTENSIONS"] = {"png", "jpg", "jpeg", "webp"}
    
    #ingore for now
    #app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "dev-key") 
    #app.config['STORAGE_TYPE'] = os.getenv("STORAGE_TYPE", "local")
    #app.config["UPLOAD_FOLDER"] = "website/static/uploads"


    db.init_app(app)

    CORS(app, supports_credentials=True)

    from .api import api
    from .auth import auth
    app.register_blueprint(api)
    app.register_blueprint(auth)

    with app.app_context():
        db.create_all()

    return app