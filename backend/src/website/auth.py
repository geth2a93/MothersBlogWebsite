from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint
from flask_login import login_required, current_user
from . import db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing credentials"}), 400

    #user = User.query.filter_by(username=data['username']).first()

    #if user and check_password_hash(user.password, data['password']):
        #return jsonify({"message": "Logged in"}), 200

    return jsonify({"error": "Invalid credentials"}), 401



#ignore for now
@auth.route("/book/uploadcover", methods=["POST"])
@login_required
def upload_cover():
    file = request.files.get("image")

    url = save_file(file, subfolder="book")

    if not url:
        return jsonify({"error": "No file"}), 400

    return jsonify({"image_url": url}), 200

@auth.route("/blog/uploadimage", methods=["POST"])
@login_required
def upload_image():
    file = request.files.get("image")

    url = save_file(file, subfolder="blogpics")

    if not url:
        return jsonify({"error": "No file"}), 400

    return jsonify({"image_url": url}), 200