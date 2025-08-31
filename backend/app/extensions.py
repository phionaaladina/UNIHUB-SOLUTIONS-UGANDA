from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_mail import Mail # <--- Make sure this is imported

migrate = Migrate()
db = SQLAlchemy()
bcrypt = Bcrypt()
mail = Mail() # <--- Instantiate the Mail object here
jwt = JWTManager()
