from . import db
from sqlalchemy import event
from cloudinary import uploader
import os


class Project(db.Model):
    '''Project model'''
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(400), nullable=False)
    live_url = db.Column(db.String(255), nullable=False)
    github_url = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    view_order = db.Column(db.SmallInteger, nullable=False, unique=True)

    colour_scheme = db.relationship('ProjectColourScheme',
                                    back_populates='project',
                                    uselist=False,
                                    lazy='joined',
                                    cascade='all, delete-orphan',
                                    single_parent=True)

    skills = db.relationship('Skill',
                             secondary='project_skills',
                             backref='projects',
                             lazy='joined')

    def delete_cloudinary_image(self):
        # Get public ID
        public_id = self.image_url.split('/')[-1].split('.')[0]
        # Add folder to public ID
        public_id = f"{os.environ.get('CLOUDINARY_FOLDER')}/{public_id}"
        uploader.destroy(public_id,
                         invalidate=True)  # Deletes img and CDN cache

    def __str__(self):
        return self.title


@event.listens_for(Project, 'before_delete')
def delete_cloudinary_image(mapper, connection, target):
    '''Delete Cloudinary image before deleting project'''
    target.delete_cloudinary_image()


@event.listens_for(Project, 'before_delete')
def update_view_order(mapper, connection, target):
    '''Update view order when deleting project'''
    projects = Project.query.filter(
        Project.view_order > target.view_order).all()
    for project in projects:
        project.view_order -= 1


@event.listens_for(Project, 'before_insert')
def set_view_order(mapper, connection, target):
    '''Set view order to last when project created'''
    target.view_order = Project.query.count() + 1


class ProjectColourScheme(db.Model):
    '''Project Colour Scheme model (HEX values)'''
    __tablename__ = 'project_colour_schemes'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'),
                           unique=True)
    primary_colour = db.Column(db.String(7), nullable=False)
    secondary_colour = db.Column(db.String(7), nullable=False)
    text_colour = db.Column(db.String(7), nullable=False)
    highlight_colour = db.Column(db.String(7), nullable=False)

    project = db.relationship('Project',
                              back_populates='colour_scheme',
                              lazy='joined')

    def __str__(self):
        return f'Project #{self.project_id}: {self.primary_colour},'\
            f'{self.secondary_colour}, {self.text_colour},'\
            f'{self.highlight_colour}'


class ProjectSkill(db.Model):
    '''Links projects to skills'''
    __tablename__ = 'project_skills'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'))

    __table_args__ = (
        db.UniqueConstraint('project_id', 'skill_id',
                            name='unique_project_skill'),
    )

    def __str__(self):
        return self.name
