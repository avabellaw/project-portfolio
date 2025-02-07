from flask import redirect, url_for

from flask_admin import Admin, AdminIndexView, expose
from flask_admin.menu import MenuLink

from flask_login import current_user

from .project_view import ProjectView
from .skill_view import SkillView

from models import db
from models.project import Project
from models.skill import Skill


class AdminIndexView(AdminIndexView):
    '''Admin index view class to override admin index view'''

    def is_visible(self):
        # This view won't appear in the menu structure
        return False

    @expose('/')
    def index(self):
        projects = Project.query
        total_projects = projects.count()
        total_skills = Skill.query.count()
        return self.render('admin/index.html',
                           total_projects=total_projects,
                           total_skills=total_skills,
                           projects=projects)

    def is_accessible(self):
        '''Check if user is authenticated'''
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        '''Redirect to login if user is not authenticated'''
        return redirect(url_for('login'))


admin = Admin(name='Porfolio Panel',
              template_mode='bootstrap3',
              base_template='admin/base-custom.html',
              index_view=AdminIndexView(name='Home'))

admin.add_link(MenuLink(name='Logout', url='logout'))

admin.add_view(ProjectView(Project, db.session))
admin.add_view(SkillView(Skill, db.session))
