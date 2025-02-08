import os

# Use an in-memory database for testing.
os.environ['DB_URL'] = 'sqlite:///:memory:'
