import pytest

from models.project import Project
from app import app as flask_app, db


@pytest.fixture()
def app():
    with flask_app.app_context():
        yield flask_app


@pytest.fixture()
def client(app):
    with app.test_client() as client:
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

        db.create_all()

        # Create test project

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
