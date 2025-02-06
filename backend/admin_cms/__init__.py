from flask_admin import Admin

from .project_view import ProjectView

from models import db
from models.project import Project

admin = Admin(name='Porfolio Panel', template_mode='bootstrap3')


admin.add_view(ProjectView(Project, db.session))
