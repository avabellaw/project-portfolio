from flask import Flask
from flask_restful import Api, Resource, marshal_with, fields, abort

from dotenv import load_dotenv

import os

from backend.models import db
from backend.models.project import Project as ProjectModel, \
    ProjectColourScheme as ColourSchemeModel

from request_parsers import project_parser

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

    @marshal_with(project_fields)
    def post(self):
        args = project_parser.parse_args()
        project = ProjectModel(title=args['title'],
                               description=args['description'],
                               live_url=args['live_url'],
                               github_url=args['github_url'],
                               image_url='TEMPORARY IMAGE URL')
        db.session.add(project)
        db.session.flush()

        colour_scheme = ColourSchemeModel(
            project_id=project.id,
            primary_colour=args['primary_colour'],
            secondary_colour=args['secondary_colour'],
            text_colour=args['text_colour']
        )
        db.session.add(colour_scheme)
        db.session.commit()
        return project, 201


class Project(Resource):
    @marshal_with(project_fields)
    def get(self, project_id):
        project = ProjectModel.query.get(project_id)
        if not project:
            abort(404, message='Project not found')

        return project


class ProjectSkills(Resource):
    @marshal_with(skill_fields)
    def get(self, project_id):
        project = ProjectModel.query.get(project_id)
        if not project:
            abort(404, message='Project not found')
        skills = project.project_skills
        if not skills:
            abort(404, message='No skills found for this project')
        return skills


api.add_resource(Projects, '/api/projects')
api.add_resource(Project, '/api/projects/<int:project_id>')

if __name__ == '__main__':
    app.run(debug=eval(os.environ.get('DEBUG', False)))
