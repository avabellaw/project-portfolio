from flask import Flask
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy

from dotenv import load_dotenv

import os


app = Flask(__name__)

load_dotenv()  # Load environment variables from .env file

# Configurations
app.secret_key = os.environ.get('SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL")

# Initialize extensions
api = Api(app)
db = SQLAlchemy(app)


class HelloWorld(Resource):
    def get(self):
        return {'message': 'world'}


api.add_resource(HelloWorld, '/api')

if __name__ == '__main__':
    app.run(debug=True)
