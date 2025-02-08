import pytest

from models.project import Project

from app import app as flask_app, db


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
