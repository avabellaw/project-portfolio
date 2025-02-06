from flask_admin.contrib.sqla import ModelView

from models.project import ProjectColourScheme
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter
from flask_admin.form import FileUploadField
from models.skill import Skill
from flask_admin.contrib.sqla.fields import CheckboxListField
from wtforms.validators import DataRequired

from io import BytesIO
from cloudinary.uploader import upload

import os


class CloudinaryUploadField(FileUploadField):
    def process_formdata(self, valuelist):
        if valuelist:
            file_data = valuelist[0]
            if hasattr(file_data, 'read'):
                self.data = file_data.read()


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
        ),
        'image': CloudinaryUploadField(
            'Image',
            validators=[DataRequired(message='Image required')]),
    }

    form_columns = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image',
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

    def on_model_change(self, form, model, is_created):
        if form.image.data:
            result = upload(BytesIO(form.image.data),
                            folder=os.environ.get('CLOUDINARY_FOLDER'))
            model.image_url = result['secure_url']
