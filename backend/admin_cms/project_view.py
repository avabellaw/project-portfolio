from flask_admin.contrib.sqla import ModelView

from models.project import ProjectColourScheme
from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter
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

    def delete_img_from_cloudinary(self, image_url):
        '''Deletes image from Cloudinary'''
        public_id = image_url.split('/')[-1].split('.')[0]  # Get public ID
        # Add folder to public ID
        public_id = f"{os.environ.get('CLOUDINARY_FOLDER')}/{public_id}"
        uploader.destroy(public_id,
                         invalidate=True)  # Deletes img and CDN cache

    def on_model_delete(self, model):
        '''ModelView on modal delet override'''
        self.delete_img_from_cloudinary(model.image_url)

    def on_model_change(self, form, model, is_created):
        if form.image.data:
            result = uploader.upload(BytesIO(form.image.data),
                                     folder=os.environ.get('CLOUDINARY_FOLDER'))
            if model.image_url:
                self.delete_img_from_cloudinary(model.image_url)
            model.image_url = result['secure_url']
