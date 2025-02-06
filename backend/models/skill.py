from . import db


class Skill(db.Model):
    '''Skill Tag model'''
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(12))  # unqiue=True breaks flask-admin panel

    project_skills = db.relationship('ProjectSkill',
                                     backref='skill',
                                     lazy='joined',
                                     cascade='all, delete-orphan')

    __table_args__ = (
        db.UniqueConstraint('name', name='unique_skill_name'),
    )

    def __str__(self):
        return self.name
