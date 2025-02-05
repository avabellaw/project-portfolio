from flask import Flask

from dotenv import load_dotenv

import os

from models import db
from endpoints import api

app = Flask(__name__)

load_dotenv()  # Load environment variables from .env file

# Configurations
app.secret_key = os.environ.get('SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL")


db.init_app(app)  # Initialize SQLAlchemy in models.py
api.init_app(app)  # Initialize Flask-RESTful in endpoints.py

if __name__ == '__main__':
    app.run(debug=eval(os.environ.get('DEBUG', False)))
