# src/api/routes.py
"""
API endpoints
"""
from flask import Blueprint, request, jsonify, current_app, Flask
from flask_bcrypt import Bcrypt
from api.models import db, User
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import hashlib

api = Blueprint('api', __name__)
CORS(api)  # opcional si ya tienes CORS a nivel app

@api.route('/user', methods=['GET'])
def get_users():
    all_users = User.query.all()
    results = [user.serialize() for user in all_users]
    return jsonify(results), 200

@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"msg": "user not found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/signup', methods=['POST'])
def signup():
    try:
        body = request.get_json(force=True) or {}
        required_fields = ["firstname", "lastname",
                           "username", "email", "password"]
        for field in required_fields:
            if not body.get(field):
                return jsonify({"error": f"el campo '{field}' es requerido y no puede estar vacío"}), 400

        email = body["email"].strip().lower()

        if User.query.filter(db.func.lower(User.email) == email).first():
            return jsonify({"error": "email ya registrado"}), 409

        # password_hash = hash(body["password"])
        password_hash = hashlib.sha224(body["password"].encode("utf-8")).hexdigest()

        new_user = User(
            email=email,
            password=password_hash,
            username=body["username"],
            firstname=body["firstname"],
            lastname=body["lastname"]
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "usuario creado"}), 201

    except Exception as e:
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500

@api.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True) or {}
    email = (body.get('email') or "").strip().lower()
    password = body.get('password') or ""
    if not email or not password:
        return jsonify({"msg": "email or password required"}), 400

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if not user:
        return jsonify({"msg": "invalid email or password"}), 401

    input_hash = hashlib.sha224(password.encode("utf-8")).hexdigest()
    if not user or user.password != input_hash:
        return jsonify({"msg": "invalid email or password"}), 401

    token = create_access_token(identity=user.id)
    return jsonify(
        access_token=token, 
        user_id=user.id, 
        user={
        "firstname": user.firstname,
        "username": user.username,
        "email": user.email
    }), 200


