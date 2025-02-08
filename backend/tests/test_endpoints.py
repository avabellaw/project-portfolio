from models.project import Project
import json


def test_get_all_projects(client):
    headers = {
        'Origin': 'http://localhost:3000',
    }
    res = client.get('/api/projects', headers=headers)

    project_count = Project.query.count()

    projects = json.loads(res.data)

    assert len(projects) == project_count
    assert res.status_code == 200
