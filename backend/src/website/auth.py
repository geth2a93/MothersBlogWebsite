from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint, current_app
from flask_login import login_required, login_user, logout_user
from datetime import datetime
import os, uuid, json
from . import db

from .models import *
from flask import request, jsonify, session
from flask_login import login_user, current_user
from flask import session
from flask_login import current_user


auth = Blueprint('auth', __name__,  url_prefix="/auth")

@auth.route("/check", methods=["GET"])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True
        }), 200

    return jsonify({
        "authenticated": False
    }), 401


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):

        print("BEFORE LOGIN:", dict(session))
        print("USER ID:", user.get_id())

        login_user(user)

        print("AFTER LOGIN:", dict(session))
        print("AUTHENTICATED:", current_user.is_authenticated)

        return jsonify({
            "message": "Logged in",
            "user_id": user.get_id(),
            "authenticated": current_user.is_authenticated,
            "session": dict(session)
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({
        "message": "Logged out successfully"
    }), 200



#to be deleted, will add admin later
@auth.route("/createuser", methods=["POST"])
def createuser():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON"}), 400
    
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    hashed = generate_password_hash(password)

    newUser = User(username=username, password=hashed, email=email)
    db.session.add(newUser)
    db.session.commit()

    return jsonify({"message": "success"}), 200