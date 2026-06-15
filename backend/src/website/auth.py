from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint, current_app
from flask_login import login_required, login_user
from datetime import datetime
import os, uuid, json
from . import db
from .models import *


auth = Blueprint('auth', __name__,  url_prefix="/auth")

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
        login_user(user)
        return jsonify({"message": "Logged in"}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    return



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