from app import db
import json

from models.project import Project

from . import get_origin_urls
HOST_REACT, HOST_API = get_origin_urls()


def test_get_all_projects(client):
    headers = {
        'Origin': HOST_REACT,
    }
    res = client.get('/api/projects', headers=headers)

    project_count = Project.query.count()

    projects = json.loads(res.data)

    assert len(projects) == project_count
    assert res.status_code == 200


def test_get_project(client):
    headers = {
        'Origin': HOST_REACT,
    }
    res = client.get('/api/projects/1', headers=headers)

    project = json.loads(res.data)

    assert project['title'] == 'Test Project'
    assert res.status_code == 200


def test_return_error_msg_on_db_connection_lost(client):
    headers = {
        'Origin': HOST_REACT,
    }

    db.engine.dispose()

    res = client.get('/api/projects', headers=headers)

    assert res.status_code == 500
    assert b'Database error' in res.data
