from flask_admin.contrib.sqla import ModelView
from flask_admin.form.upload import FileUploadField


class ProfileView(ModelView):
    form_extra_fields = {
        'image_url': FileUploadField('Image', base_path='uploads')
    }
