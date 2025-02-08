from . import db
from sqlalchemy import event
from cloudinary import uploader
import os


class Project(db.Model):
    '''Project model'''
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    live_url = db.Column(db.String(255), nullable=False)
    github_url = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)

    colour_scheme = db.relationship('ProjectColourScheme',
                                    backref=db.backref('project',
                                                       lazy='joined',
                                                       uselist=False),
                                    lazy='joined',
                                    cascade='all, delete-orphan')

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


class ProjectColourScheme(db.Model):
    '''Project Colour Scheme model (HEX values)'''
    __tablename__ = 'project_colour_schemes'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    primary_colour = db.Column(db.String(6), nullable=False)
    secondary_colour = db.Column(db.String(6), nullable=False)
    text_colour = db.Column(db.String(6), nullable=False)

    def __str__(self):
        return f'Project #{self.project_id}: {self.primary_colour},'
        f'{self.secondary_colour}, {self.text_colour}'


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
