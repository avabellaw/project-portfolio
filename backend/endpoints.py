from flask_restful import Resource, Api, abort, marshal_with

from models import db

from models.project import Project as ProjectModel
from models.skill import Skill as SkillModel

# JSON response schemas / JSON serializers
from reponse_schemas import project_fields, skill_fields

api = Api()


# API RESTful endpoints
class Projects(Resource):
    @marshal_with(project_fields)
    def get(self):
        '''Get all projects'''
        return ProjectModel.query.all()


class Project(Resource):
    @marshal_with(project_fields)
    def get(self, project_id):
        '''Get project by ID'''
        project = db.session.get(ProjectModel, project_id)
        if not project:
            abort(404, message='Project not found')

        return project


class Skills(Resource):
    @marshal_with(skill_fields)
    def get(self):
        '''Get all skills'''
        return SkillModel.query.all()


class Skill(Resource):
    @marshal_with(skill_fields)
    def get(self, skill_id):
        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')
        return skill


class ProjectsBySkill(Resource):
    '''Endpoint to get projects by skill'''

    @marshal_with(project_fields)
    def get(self, skill_id):
        '''Get projects by skill'''

        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')

        project_skills = skill.project_skills

        return [ps.project for ps in project_skills]


api.add_resource(Projects, '/api/projects')
api.add_resource(Project, '/api/projects/<int:project_id>')
api.add_resource(Skills, '/api/skills')
api.add_resource(Skill, '/api/skills/<int:skill_id>')
api.add_resource(ProjectsBySkill, '/api/projects-by-skill/<int:skill_id>')
