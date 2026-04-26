from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
        return jsonify({"message": "Logged in"}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth.route('/admin-reset-password', methods=['POST'])
def admin_reset_password():
    data = request.get_json()
    db.session.commit()
    return {"message": "Password reset successful"}