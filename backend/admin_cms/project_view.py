from flask_admin.contrib.sqla import ModelView
from models.project import ProjectColourScheme
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter


class ProjectView(ModelView):
    can_delete = True
    can_create = True
    can_edit = True
    inline_converter = InlineOneToOneModelConverter

    inline_models = (ProjectColourScheme,)

    column_list = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
        'colour_scheme'
    ]
