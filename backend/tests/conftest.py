import pytest

from models.project import Project

from app import app as flask_app, db
from models.user import User

from flask_bcrypt import Bcrypt

# Database url set in __init__.py to in memory sqlite database


@pytest.fixture()
def app():
    flask_app.config['TESTING'] = True

    with flask_app.app_context():
        yield flask_app


@pytest.fixture()
def client(app):
    with app.test_client() as client:
        db.create_all()

        b = Bcrypt()
        password = b.generate_password_hash('password123').decode('utf-8')
        db.session.add(User(username='admin', password=password))
        db.session.commit()

        add_test_data()

        yield client

        db.session.remove()
        db.drop_all()


def add_test_data():
    project = Project(
        title='Test Project',
        description='Test Description',
        live_url='http://test.com',
        github_url='http://github.com/test',
        image_url='http://test.com/image.jpg'
    )

    db.session.add(project)
    db.session.commit()
