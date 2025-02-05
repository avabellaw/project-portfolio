from flask import Flask
from flask_restful import Api, Resource, marshal_with, fields, abort
from sqlalchemy.exc import IntegrityError

from dotenv import load_dotenv

import os

from models import db
from models.project import Project as ProjectModel, \
    ProjectColourScheme as ColourSchemeModel, Skill as SkillModel, \
    ProjectSkill as ProjectSkillModel

from request_parsers import project_parser, skill_parser

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

skill_fields = {
    'id': fields.Integer,
    'name': fields.String
}

project_skill_fields = {
    'skill': fields.Nested(skill_fields)
}

project_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'description': fields.String,
    'live_url': fields.String,
    'github_url': fields.String,
    'image_url': fields.String,
    'colour_scheme': fields.Nested(colour_scheme_fields),
    'project_skills': fields.List(fields.Nested(project_skill_fields))
}


# API RESTful endpoints
class Projects(Resource):
    @marshal_with(project_fields)
    def get(self):
        '''Get all projects'''
        return ProjectModel.query.all()

    @marshal_with(project_fields)
    def post(self):
        '''Create a new project'''
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

        if args['skills']:
            for skill_id in args['skills']:
                skill = SkillModel.query.get(skill_id)
                if skill:
                    project_skill = ProjectSkillModel(project_id=project.id,
                                                      skill_id=skill.id)
                    db.session.add(project_skill)
                else:
                    abort(404, message=f'Skill ID:{skill_id} not found')

        db.session.commit()
        return project, 201


class Project(Resource):
    @marshal_with(project_fields)
    def get(self, project_id):
        '''Get project by ID'''
        project = ProjectModel.query.get(project_id)
        if not project:
            abort(404, message='Project not found')

        return project


class Skills(Resource):
    @marshal_with(skill_fields)
    def get(self):
        '''Get all skills'''
        return SkillModel.query.all()

    @marshal_with(skill_fields)
    def post(self):
        '''Create a new skill'''
        args = skill_parser.parse_args()
        try:
            skill = SkillModel(name=args['name'])

            db.session.add(skill)
            db.session.commit()

            return skill, 201
        except IntegrityError:
            abort(400, message='Skill already exists')


class Skill(Resource):
    @marshal_with(skill_fields)
    def get(self, skill_id):
        skill = SkillModel.query.get(skill_id)
        if not skill:
            abort(404, message='Skill not found')
        return skill

    @marshal_with(skill_fields)
    def put(self, skill_id):
        skill = SkillModel.query.get(skill_id)
        if not skill:
            abort(404, message='Skill not found')
        args = skill_parser.parse_args()
        skill.name = args['name']
        db.session.commit()
        return skill

    def delete(self, skill_id):
        skill = SkillModel.query.get(skill_id)
        if not skill:
            abort(404, message='Skill not found')
        db.session.delete(skill)
        db.session.commit()
        return '', 204


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
api.add_resource(Skills, '/api/skills')
api.add_resource(Skill, '/api/skills/<int:skill_id>')

if __name__ == '__main__':
    app.run(debug=eval(os.environ.get('DEBUG', False)))
