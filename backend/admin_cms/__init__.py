from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from .project_view import ProjectView
# from .skills_view import SkillsView

from models import db
from models.project import Project
from models.skill import Skill

admin = Admin(name='Porfolio Panel', template_mode='bootstrap3')


admin.add_view(ModelView(Skill, db.session))
admin.add_view(ProjectView(Project, db.session))
