from flask_admin import Admin

from .project_view import ProjectView
from .skill_view import SkillView

from models import db
from models.project import Project
from models.skill import Skill

admin = Admin(name='Porfolio Panel', template_mode='bootstrap3')


admin.add_view(ProjectView(Project, db.session))
admin.add_view(SkillView(Skill, db.session))
