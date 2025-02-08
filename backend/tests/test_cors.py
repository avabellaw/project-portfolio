import os

HOST_REACT = str(os.environ.get('ALLOWED_HOST_REACT'))
HOST_API = str(os.environ.get('ALLOWED_HOST_API'))


def test_cors_blocked_get(client):
    headers = {
        'Origin': 'http://fake:2',
    }

    res = client.get('/api/projects/1', headers=headers)
    assert 'Access-Control-Allow-Origin' not in res.headers


def test_cors_allowed_get(client):
    origin = HOST_REACT

    headers = {
        'Origin': origin,
    }
    res = client.get('/api/projects/1', headers=headers)
    assert 'Access-Control-Allow-Origin' in res.headers
    assert res.headers['Access-Control-Allow-Origin'] == origin


def test_cors_blocked_react_post(client):
    headers = {
        'Origin': HOST_REACT,
    }

    body = {
        'title': 'Test2',
        'description': 'Test',
        'live_url': 'http://test.com',
        'github_url': 'http://test.com',
        'image_url': 'http://test.com',
        'primary_colour': '#000',
        'secondary_colour': '#000',
        'text_colour': '#000',
    }

    res = client.post('/admin/project', headers=headers, json=body)
    assert 'Access-Control-Allow-Origin' not in res.headers
