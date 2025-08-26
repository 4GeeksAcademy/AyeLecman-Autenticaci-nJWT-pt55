"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['GET'])
def get_users():
    all_users = User.query.all()
    results = list(map(lambda user: user.serialize(), all_users))

    return jsonify(results), 200


@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"msg": "user not found"}), 404
    
    return jsonify(user.serialize()), 200

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True) or {}
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({"msg": "email or password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "email already exists"}), 409

    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "user created"}), 201

@api.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True) or {}
    email = body.get('email')
    password = body.get('password')
    if not email or not password:
        return jsonify({"msg": "email or password required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify({"msg": "invalid email or password"}), 401

    token = create_access_token(identity=user.id)

    return jsonify(access_token=token, user_id=user.id), 200

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    uid = get_jwt_identity()
    return jsonify(ok=True, user_id=uid, message="Accediste a /protected"), 200
