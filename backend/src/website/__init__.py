from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from os import path

db = SQLAlchemy()
DB_NAME = 'books.db'

def create_app():

    app = Flask(__name__)
    app.config['SECRET_KEY'] = "key"
    #app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "dev-key")
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['STORAGE_TYPE'] = os.getenv("STORAGE_TYPE", "local")
    app.config["UPLOAD_FOLDER"] = "website/static/uploads"
    db.init_app(app)

    CORS(app)

    from .views import views
    from .auth import auth
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    with app.app_context():
        db.create_all()

    return app