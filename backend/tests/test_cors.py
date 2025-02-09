from . import get_origin_urls
HOST_REACT, HOST_API = get_origin_urls()


def test_admin_login_cors(client):
    headers = {
        'Origin': HOST_API
    }

    data = {
        'username': 'admin',
        'password': 'password123'
    }

    # Login request
    res = client.post('/admin/login',
                      headers=headers,
                      data=data,
                      follow_redirects=True)

    assert 'Access-Control-Allow-Origin' in res.headers
    assert res.headers['Access-Control-Allow-Origin'] == HOST_API


def test_admin_login_cors_blocked_react(client):
    headers = {
        'Origin': HOST_REACT
    }

    data = {
        'username': 'admin',
        'password': 'password123'
    }

    # Login request
    res = client.post('/admin/login',
                      headers=headers,
                      data=data,
                      follow_redirects=True)

    assert 'Access-Control-Allow-Origin' not in res.headers


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
        'Accept': 'application/json'
    }
    res = client.get('/api/projects/1', headers=headers)
    assert 'Access-Control-Allow-Origin' in res.headers
    assert res.headers['Access-Control-Allow-Origin'] == origin
