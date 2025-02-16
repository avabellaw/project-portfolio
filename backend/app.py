from dotenv import load_dotenv
import cloudinary

from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, login_user, logout_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt

import os

from endpoints import api
from admin_cms import admin
from models.user import User
from models import db
from flask_migrate import Migrate 


load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
migrate = Migrate(app, db)

# Allowed hosts

resources = {
    r"/api/*": {"origins": str(os.environ.get('ALLOWED_HOSTS_REACT'))},
    r"/admin/*": {"origins": str(os.environ.get('ALLOWED_HOSTS_API'))},
}

CORS(app, resources=resources)


# Configurations
app.secret_key = os.environ.get('SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL")
LOGIN_URL = 'admin/login'

login_manager = LoginManager()
login_manager.login_view = LOGIN_URL

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
)

db.init_app(app)  # Initialize SQLAlchemy in models.py
api.init_app(app)  # Initialize Flask-RESTful in endpoints.py
admin.init_app(app)  # Initialize Flask-Admin
migrate.init_app(app, db)  # Initialize Flask-Migrate
login_manager.init_app(app)  # Initlize Flask-Login manager
bcrypt = Bcrypt()  # Initialize Flask-Bcrypt


# User authentication

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    validation_error = None

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if not user:
            # User admin can check, enhanced security
            print('User not found')
        if bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('admin.index'))
        else:
            validation_error = 'Invalid credentials'
    return render_template('admin/login.html',
                           validation_error=validation_error)


@app.route('/admin/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=eval(os.environ.get('DEBUG', False)))
