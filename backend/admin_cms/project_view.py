from flask_admin.contrib.sqla import ModelView
from models.project import ProjectColourScheme
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter
from models.skill import Skill
from flask_admin.contrib.sqla.fields import QuerySelectMultipleField
from wtforms.widgets import ListWidget, CheckboxInput


class ProjectView(ModelView):
    can_delete = True
    can_create = True
    can_edit = True
    inline_converter = InlineOneToOneModelConverter

    inline_models = (ProjectColourScheme,)

    form_extra_fields = {
        'skills': QuerySelectMultipleField(
            'Skills',
            query_factory=lambda: Skill.query.all(),
            get_label='name',
            widget=ListWidget(prefix_label=False),
            option_widget=CheckboxInput()
        )
    }

    column_list = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
        'colour_scheme',
        'skills'
    ]

    form_columns = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
        'colour_scheme',
        'skills'
    ]
