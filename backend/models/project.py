from . import db


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

    def __str__(self):
        return self.title


class ProjectColourScheme(db.Model):
    '''Project Colour Scheme model (HEX values)'''
    __tablename__ = 'project_colour_schemes'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    primary_colour = db.Column(db.String(6), nullable=False)
    secondary_colour = db.Column(db.String(6), nullable=False)
    text_colour = db.Column(db.String(6), nullable=False)

    def __str__(self):
        return f'{self.project_id} - {self.id}'


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
