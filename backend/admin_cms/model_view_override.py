
from flask_admin.contrib.sqla import ModelView as DefaultModelView
from flask_login import current_user
from flask import redirect, url_for


class ModelView(DefaultModelView):
    '''Model view base class to override model view'''
    def is_accessible(self):
        '''Check if user is authenticated'''
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        '''Redirect to login if user is not authenticated'''
        return redirect(url_for('login'))
