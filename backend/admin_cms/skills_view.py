from flask_admin.contrib.sqla import ModelView
from models.project import Skill
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter


class SkillsView(ModelView):
    can_delete = True
    can_create = True
    can_edit = True
    column_list = ['id', 'name']
    form_columns = ['id', 'name']

    column_formatters = {}

    column_labels = {
        'id': 'Skill ID',
        'name': 'Skill Name'
    }

    def __init__(self, model, session):
        super(SkillsView, self).__init__(model, session)
