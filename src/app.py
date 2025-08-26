"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# ---- DB configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)  # ✅ primero bind de db a la app

MIGRATE = Migrate(app, db, compare_type=True)  # ✅ luego migrate

# ---- CORS (útil si vas a consumir desde frontend)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---- JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "4geeks-fullstack-bootcamp")  # cámbialo en .env en prod
app.config["JWT_TOKEN_LOCATION"] = ["headers"]  # usamos Authorization: Bearer <token>
jwt = JWTManager(app)

# ---- Bcrypt
bcrypt = Bcrypt()
bcrypt.init_app(app)  # registra en current_app.extensions['bcrypt']

# ---- Admin & commands
setup_admin(app)
setup_commands(app)

# ---- Blueprints (importar DESPUÉS de inicializar todo lo anterior)
from api.routes import api   # ✅ movido acá para evitar import circular
app.register_blueprint(api, url_prefix='/api')

# ---- Error handling
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ---- Sitemap
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# ---- Static
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
