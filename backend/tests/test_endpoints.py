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
