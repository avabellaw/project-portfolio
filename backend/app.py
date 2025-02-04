from flask import Flask
from flask_restful import Api, Resource, marshal_with, fields

from dotenv import load_dotenv

import os

from models import db, Project as ProjectModel


app = Flask(__name__)

load_dotenv()  # Load environment variables from .env file

# Configurations
app.secret_key = os.environ.get('SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL")


# Initialize extensions
api = Api(app)
db.init_app(app)

# JSON marshallers
colour_scheme_fields = {
    'primary_colour': fields.String,
    'secondary_colour': fields.String,
    'text_colour': fields.String
}

project_fields = {
    'title': fields.String,
    'description': fields.String,
    'live_url': fields.String,
    'github_url': fields.String,
    'image_url': fields.String,
    'colour_scheme': fields.Nested(colour_scheme_fields)
}

skill_fields = {
    'name': fields.String
}


# API RESTful endpoints
class Projects(Resource):
    @marshal_with(project_fields)
    def get(self):
        return ProjectModel.query.all()


class Project(Resource):
    @marshal_with(project_fields)
    def get(self, project_id):
        return ProjectModel.query.get(project_id)


class ProjectSkills(Resource):
    @marshal_with(skill_fields)
    def get(self, project_id):
        project = ProjectModel.query.get(project_id)
        return project.project_tags


api.add_resource(Projects, '/api/projects')

if __name__ == '__main__':
    app.run(debug=eval(os.environ.get('DEBUG', False)))
