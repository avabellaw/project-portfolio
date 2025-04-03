from flask_admin.contrib.sqla.form import InlineOneToOneModelConverter
from flask_admin.model.form import InlineFormAdmin
from flask_admin.form import FileUploadField
from flask_admin.contrib.sqla.fields import CheckboxListField
from flask_admin.actions import action

from wtforms.validators import DataRequired
from wtforms import TextAreaField, ValidationError

from io import BytesIO
from cloudinary import uploader

import os

from .model_view_override import ModelView

from models.skill import Skill
from models.project import ProjectColourScheme, Project
from models import db


class CloudinaryUploadField(FileUploadField):
    def process_formdata(self, valuelist):
        if valuelist:
            file_data = valuelist[0]
            if hasattr(file_data, 'read'):
                self.data = file_data.read()


class ColourSchemeInlineView(InlineFormAdmin):
    '''Controls how colour scheme is shown in project view'''
    max_entries = 1
    min_entries = 1
    inline_converter = InlineOneToOneModelConverter


def max_character_limit(limit):
    '''Custom wtforms validator to limit character count'''
    def _max_character_limit(form, field):
        length = len(field.data)
        if length > limit:
            raise ValidationError(
                f'{length - limit} character(s) over the {limit} '
                'character limit')

    return _max_character_limit


class ProjectView(ModelView):
    inline_models = (ColourSchemeInlineView(ProjectColourScheme),)

    actions = ['move_up', 'move_down']

    def get_query(self):
        '''Displays projects in order of view_order on list view'''
        return self.session.query(self.model
                                  ).order_by(self.model.view_order.asc())

    column_exclude_list = ['image_url', 'view_order']

    column_formatters = {
        'description': lambda v, c, m, p: (m.description[:50] + '...')
        if len(m.description) > 50 else m.description,
        'live_url': lambda v, c, m, p: bool(m.live_url),
        'github_url': lambda v, c, m, p: bool(m.github_url),
        'is_draft': lambda v, c, m, p: False if m.is_draft else 'Live'
    }

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
        },
        'description': {
            'rows': 5,
            'maxLength': 400  # Doesnt include return/new line chars
        }
    }

    form_args = dict(
        description=dict(validators=[max_character_limit(400)])
    )

    form_overrides = {
        'description': TextAreaField,
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
        'colour_scheme',
        'is_draft',
    ]

    column_list = [
        'view_order',
        'title',
        'description',
        'live_url',
        'github_url',
        'image_url',
        'colour_scheme',
        'skills',
        'is_draft',
    ]

    def on_model_change(self, form, model, is_created):
        if form.image.data:
            cloudinary_folder = os.environ.get('CLOUDINARY_FOLDER')
            result = uploader.upload(BytesIO(form.image.data),
                                     folder=cloudinary_folder)
            if model.image_url:
                model.delete_cloudinary_image()
            model.image_url = result['secure_url']

    @action('draft', 'Draft')
    def action_draft(self, ids):
        for id in ids:
            project = Project.query.get(id)

            project.is_draft = True

        db.session.commit()

    @action('undraft', 'Undraft')
    def action_undraft(self, ids):
        for id in ids:
            project = Project.query.get(id)

            project.is_draft = False

        db.session.commit()

    @action('move_up', 'Move Up')
    def action_move_up(self, ids):
        '''Move project order up in view order'''

        # Allows for multiple projects to be moved up
        for id in ids:
            project = Project.query.get(id)
            if project.view_order > 1:
                prev_project = Project.query.filter(
                    Project.view_order < project.view_order
                ).order_by(Project.view_order.desc()).first()

                if prev_project:
                    prev_project_order = prev_project.view_order + 1
                    prev_project.view_order = -1
                    project.view_order -= 1
                    db.session.flush()
                    prev_project.view_order = prev_project_order
                    db.session.commit()

    @action('move_down', 'Move Down')
    def action_move_down(self, ids):
        '''Move project order down in view order'''

        # Allows for multiple projects to be moved down
        for id in ids:
            project = Project.query.get(id)
            next_project = Project.query.filter(
                Project.view_order > project.view_order
            ).order_by(Project.view_order).first()

            if next_project:
                next_project_order = next_project.view_order - 1
                next_project.view_order = -1
                project.view_order += 1
                db.session.flush()
                next_project.view_order = next_project_order
                db.session.commit()
