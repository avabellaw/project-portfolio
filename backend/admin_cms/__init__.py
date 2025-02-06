from flask_admin import Admin
from .project_view import ProfileView
from models import db
from models.project import Project

admin = Admin(name='Porfolio Panel', template_mode='bootstrap3')


admin.add_view(ProfileView(Project, db.session))
