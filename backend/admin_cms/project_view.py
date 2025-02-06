from flask_admin.contrib.sqla import ModelView
from models.project import ProjectColourScheme
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter
from models.skill import Skill
from flask_admin.contrib.sqla.fields import CheckboxListField


class ProjectView(ModelView):
    can_delete = True
    can_create = True
    can_edit = True
    inline_converter = InlineOneToOneModelConverter

    inline_models = (ProjectColourScheme,)

    form_extra_fields = {
        'skills': CheckboxListField(
            'Skills',
            query_factory=lambda: Skill.query.all(),
            get_label='name',
        )
    }

    form_columns = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
        'skills',
        'colour_scheme'
    ]

    column_list = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
        'colour_scheme',
        'skills'
    ]
