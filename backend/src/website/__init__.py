from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
import os
from os import path

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():

    app = Flask(__name__)
    #app.config['SECRET_KEY'] = "key"
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-key")
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True

    uri = os.getenv("DATABASE_URL")

    if uri:
        if uri.startswith("postgres://"):
            uri = uri.replace("postgres://", "postgresql://", 1)

        app.config["SQLALCHEMY_DATABASE_URI"] = uri
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///books.db"

    
    app.config["UPLOAD_FOLDER"] = os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(__file__), "static", "uploads"))
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024
    app.config["UPLOAD_EXTENSIONS"] = {"png", "jpg", "jpeg", "webp"}

    #old
    #app.config["UPLOAD_FOLDER"] = os.path.join("website", "static", "uploads")
    #app.config["UPLOAD_FOLDER"] = "/var/data/uploads"  render's persistant storage 
    #app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__),"static","uploads")
    
    

    db.init_app(app)
    from .models import User
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))


    CORS(app, supports_credentials=True)

    from .api import api
    from .auth import auth
    from .admin import admin
    app.register_blueprint(api)
    app.register_blueprint(auth)
    app.register_blueprint(admin)

    with app.app_context():
        db.create_all()

    return app
