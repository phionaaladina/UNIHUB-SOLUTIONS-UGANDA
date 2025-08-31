from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id          = db.Column(db.Integer,   primary_key=True)
    profile_picture_url = db.Column(db.String(255), nullable=True, default='/images/default_profile.png')
    first_name  = db.Column(db.String(50), nullable=False)
    last_name   = db.Column(db.String(100),nullable=False)
    email       = db.Column(db.String(100),nullable=False, unique=True)
    contact     = db.Column(db.String(50), nullable=False, unique=True)
    password    = db.Column(db.Text(),     nullable=False)
    user_type   = db.Column(db.String(20), default='user')   # 'super_admin','admin','user'
    created_at  = db.Column(db.DateTime,   default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime,   onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email} ({self.user_type})>"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
