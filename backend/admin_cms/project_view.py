from .model_view_override import ModelView

from models.project import ProjectColourScheme
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter
from flask_admin.model.form import InlineFormAdmin
from flask_admin.form import FileUploadField
from models.skill import Skill
from flask_admin.contrib.sqla.fields import CheckboxListField
from wtforms.validators import DataRequired

from io import BytesIO
from cloudinary import uploader

import os


class CloudinaryUploadField(FileUploadField):
    def process_formdata(self, valuelist):
        if valuelist:
            file_data = valuelist[0]
            if hasattr(file_data, 'read'):
                self.data = file_data.read()


class ColourSchemeInlineView(InlineFormAdmin):
    '''Controls how colour scheme is shown in project view'''
    form_columns = ['primary_colour', 'secondary_colour',
                    'text_colour', 'text_highlight_colour']
    form_widget_args = {
        'project_id': {'disabled': True}
    }
    max_entries = 1
    min_entries = 1
    inline_converter = InlineOneToOneModelConverter


class ProjectView(ModelView):
    inline_models = (ColourSchemeInlineView(ProjectColourScheme),)

    form_extra_fields = {
        'skills': CheckboxListField(
            'Skills',
            query_factory=lambda: Skill.query.all(),
            get_label='name',
        ),
        'image': CloudinaryUploadField(
            'Image',)
    }

    form_widget_args = {
        'image_url': {
            'readonly': True
        }
    }

    def create_form(self, obj=None):
        form = super(ProjectView, self).create_form(obj)
        form.image.validators = [DataRequired(message='Image required')]
        form.image_url.data = 'No image'
        return form

    form_columns = [
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
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
            cloudinary_folder = os.environ.get('CLOUDINARY_FOLDER')
            result = uploader.upload(BytesIO(form.image.data),
                                     folder=cloudinary_folder)
            if model.image_url:
                model.delete_cloudinary_image()
            model.image_url = result['secure_url']
