from . import db


class Skill(db.Model):
    '''Skill Tag model'''
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20),
                     nullable=False)  # unqiue=True breaks flask-admin panel

    __table_args__ = (
        db.UniqueConstraint('name', name='unique_skill_name'),
    )

    def __str__(self):
        return self.name
