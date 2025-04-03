from flask_restful import Resource, Api, abort, marshal_with

from models import db

from models.project import Project as ProjectModel
from models.skill import Skill as SkillModel

# JSON response schemas / JSON serializers
from reponse_schemas import project_fields, skill_fields

api = Api()


def error_handler(function):
    '''Decorator to handle exceptions in API endpoints'''
    def add_error_handling(*args, **kwargs):
        try:
            return function(*args, **kwargs)
        except Exception as e:
            abort(500, message=f'Database error: {e}')

    return add_error_handling


# API RESTful endpoints
class Projects(Resource):
    @error_handler
    @marshal_with(project_fields)
    def get(self):
        '''Get all projects'''
        live_projects = ProjectModel.query.filter(
            ProjectModel.is_draft == False)
        return live_projects.order_by(ProjectModel.view_order.asc()).all()


class Project(Resource):
    @error_handler
    @marshal_with(project_fields)
    def get(self, project_id):
        '''Get project by ID'''
        project = db.session.get(ProjectModel, project_id)
        if not project:
            abort(404, message='Project not found')

        return project


class Skills(Resource):
    @error_handler
    @marshal_with(skill_fields)
    def get(self):
        '''Get all skills'''
        return SkillModel.query.all()


class Skill(Resource):
    @error_handler
    @marshal_with(skill_fields)
    def get(self, skill_id):
        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')
        return skill


class ProjectsBySkill(Resource):
    '''Endpoint to get projects by skill'''

    @error_handler
    @marshal_with(project_fields)
    def get(self, skill_id):
        '''Get projects by skill'''

        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')

        return skill.projects


api.add_resource(Projects, '/api/projects')
api.add_resource(Project, '/api/projects/<int:project_id>')
api.add_resource(Skills, '/api/skills')
api.add_resource(Skill, '/api/skills/<int:skill_id>')
api.add_resource(ProjectsBySkill, '/api/projects-by-skill/<int:skill_id>')
