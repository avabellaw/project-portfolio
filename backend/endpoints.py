from flask_restful import Resource, Api, abort, marshal_with

from sqlalchemy.exc import IntegrityError

from models import db

from models.project import Project as ProjectModel, \
    ProjectColourScheme as ColourSchemeModel, \
    ProjectSkill as ProjectSkillModel
from models.skill import Skill as SkillModel

from request_parsers import project_parser, skill_parser

# JSON response schemas / JSON serializers
from reponse_schemas import project_fields, skill_fields

api = Api()


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
                skill = db.session.get(SkillModel, skill_id)
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
        project = db.session.get(ProjectModel, project_id)
        if not project:
            abort(404, message='Project not found')

        return project

    @marshal_with(project_fields)
    def put(self, project_id):
        '''Update a project'''
        project = db.session.get(ProjectModel, project_id)
        if not project:
            abort(404, message='Project not found')
        args = project_parser.parse_args()
        project.title = args['title']
        project.description = args['description']
        project.live_url = args['live_url']
        project.github_url = args['github_url']
        project.image_url = 'TEMPORARY IMAGE URL'

        colour_scheme = project.colour_scheme
        colour_scheme.primary_colour = args['primary_colour']
        colour_scheme.secondary_colour = args['secondary_colour']
        colour_scheme.text_colour = args['text_colour']
        db.session.commit()

        return project

    def delete(self, project_id):
        '''Delete a project'''
        project = db.session.get(ProjectModel, project_id)
        if not project:
            abort(404, message='Project not found')
        db.session.delete(project)
        db.session.commit()
        return '', 204


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
            # Violates unique constraint
            abort(400, message='Skill already exists')


class Skill(Resource):
    @marshal_with(skill_fields)
    def get(self, skill_id):
        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')
        return skill

    @marshal_with(skill_fields)
    def put(self, skill_id):
        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')
        args = skill_parser.parse_args()
        skill.name = args['name']
        db.session.commit()
        return skill

    def delete(self, skill_id):
        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')
        db.session.delete(skill)
        db.session.commit()
        return '', 204


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


class ProjectSkill(Resource):
    '''Add or delete skills on a project'''

    @marshal_with(project_fields)
    def post(self, project_id, skill_id):
        '''Add a skill to a project'''
        project = db.session.get(ProjectModel, project_id)

        if not project:
            abort(404, message='Project not found')

        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')

        project_name = project.title
        skill_name = skill.name

        try:
            project_skill = ProjectSkillModel(project_id=project.id,
                                              skill_id=skill.id)
            db.session.add(project_skill)
            db.session.commit()
            return project, 201
        except IntegrityError:
            # Violates unique constraint
            abort(400,
                  message=f"'{skill_name}' already a skill "
                  f"for project '{project_name}'")

    @marshal_with(project_fields)
    def delete(self, project_id, skill_id):
        '''Delete a skill from a project'''
        project = db.session.get(ProjectModel, project_id)

        if not project:
            abort(404, message='Project not found')

        skill = db.session.get(SkillModel, skill_id)
        if not skill:
            abort(404, message='Skill not found')

        project_skill = db.session.query(ProjectSkillModel).filter_by(
            project_id=project.id, skill_id=skill.id).first()

        if not project_skill:
            abort(404, message='Skill not found for project')

        db.session.delete(project_skill)
        db.session.commit()
        return '', 204


api.add_resource(Projects, '/api/projects')
api.add_resource(Project, '/api/projects/<int:project_id>')
api.add_resource(Skills, '/api/skills')
api.add_resource(Skill, '/api/skills/<int:skill_id>')
api.add_resource(ProjectsBySkill, '/api/projects-by-skill/<int:skill_id>')
api.add_resource(
    ProjectSkill, '/api/projects/<int:project_id>/skill/<int:skill_id>')
