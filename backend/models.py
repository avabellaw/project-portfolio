from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Project(db.Model):
    '''Project model'''
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    live_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    image_url = db.Column(db.String(255))

    colour_scheme = db.relationship('ProjectColourScheme',
                                    backref=db.backref('project',
                                                       lazy='joined',
                                                       uselist=False),
                                    lazy='joined',
                                    cascade='all, delete-orphan')

    project_tags = db.relationship('ProjectTag',
                                   backref=db.backref('project',
                                                      lazy='joined'),
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


class SkillTag(db.Model):
    '''Skill Tag model'''
    __tablename__ = 'skill_tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(12))

    def __str__(self):
        return self.name


class ProjectTag(db.Model):
    '''Links projects to skills'''
    __tablename__ = 'project_tags'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    skill_tag_id = db.Column(db.Integer, db.ForeignKey('skill_tags.id'))

    skill_tag = db.relationship('SkillTag',
                                backref='project_tags',  # lazy='select'
                                lazy='joined',
                                uselist=False)

    def __str__(self):
        return self.name
