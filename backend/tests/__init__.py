import os

# Use an in-memory database for testing.
os.environ['DB_URL'] = 'sqlite:///:memory:'


def get_origin_urls() -> str:
    return (str(os.environ.get('ALLOWED_HOSTS_REACT')),
            str(os.environ.get('ALLOWED_HOSTS_API')))
