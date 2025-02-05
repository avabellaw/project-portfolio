from . import db


class Project(db.Model):
    '''Project model'''
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(150))
    live_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    image_url = db.Column(db.String(255))

    colour_scheme = db.relationship('ProjectColourScheme',
                                    backref=db.backref('project',
                                                       lazy='joined',
                                                       uselist=False),
                                    lazy='joined',
                                    cascade='all, delete-orphan')

    project_skills = db.relationship('ProjectSkill',
                                     backref=db.backref('project',
                                                        lazy='joined'),
                                     lazy='joined',
                                     cascade='all, delete-orphan')

    def __str__(self):
        return self.title


class ProjectColourScheme(db.Model):
    '''Project Colour Scheme model (HEX values)'''
    __tablename__ = 'project_colour_schemes'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    primary_colour = db.Column(db.String(6))
    secondary_colour = db.Column(db.String(6))
    text_colour = db.Column(db.String(6))

    def __str__(self):
        return f'{self.project_id} - {self.colour_scheme_id}'


class Skill(db.Model):
    '''Skill Tag model'''
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(12), unique=True)

    def __str__(self):
        return self.name


class ProjectSkill(db.Model):
    '''Links projects to skills'''
    __tablename__ = 'project_skills'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'))

    skill = db.relationship('Skill',
                            backref='project_skills',  # lazy='select'
                            lazy='joined',
                            uselist=False)

    __table_args__ = (
        db.UniqueConstraint('project_id', 'skill_id',
                            name='unique_project_skill'),
    )

    def __str__(self):
        return self.name
