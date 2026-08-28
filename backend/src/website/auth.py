from werkzeug.security import check_password_hash
from flask import request, jsonify, Blueprint
from flask_login import login_required, login_user, logout_user, current_user
from .models import *

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
        login_user(user)

        return jsonify({
            "message": "Logged in",
            "user_id": user.get_id(),
            "authenticated": current_user.is_authenticated,
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({
        "message": "Logged out successfully"
    }), 200



