from flask import Flask

import cloudinary

from dotenv import load_dotenv

import os

from models import db
from models.project import Project
from admin_cms import admin
from endpoints import api

app = Flask(__name__)

load_dotenv()  # Load environment variables from .env file

# Configurations
app.secret_key = os.environ.get('SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL")

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


db.init_app(app)  # Initialize SQLAlchemy in models.py
api.init_app(app)  # Initialize Flask-RESTful in endpoints.py
admin.init_app(app)  # Initialize Flask-Admin


if __name__ == '__main__':
    app.run(debug=eval(os.environ.get('DEBUG', False)))
