from flask_bcrypt import Bcrypt
from models import db
from models.user import User

from getpass import getpass

from app import app


def create_superuser():
    '''Create superuser'''
    print("Create superuser:")

    username = input("Username: ")
    password = getpass("Password: ")

    bcrypt = Bcrypt()

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    with app.app_context():
        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        print(f"Superuser '{user.username}' created successfully!")


def verify_superuser(username, password):
    '''Verify superuser'''

    bcrypt = Bcrypt()

    with app.app_context():
        user = User.query.filter_by(username=username).first()

        if user:
            print(f"Superuser '{user.username}' found!")
        else:
            return False

        return bcrypt.check_password_hash(user.password, password)


def create_all_tables():
    '''Create all tables in new database'''
    with app.app_context():
        db.create_all()


def drop_all_tables():
    '''Drop all tables'''
    anws = input("Are you sure you want to drop all tables? (y/n): ")
    if anws == 'y':
        with app.app_context():
            db.drop_all()
