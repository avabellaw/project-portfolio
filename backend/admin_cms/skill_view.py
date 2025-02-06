from flask_admin.contrib.sqla import ModelView


class SkillView(ModelView):
    form_columns = ['name']
