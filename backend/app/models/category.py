# app/models.py (or wherever you keep your model definitions)
from app.extensions import db
from datetime import datetime



class Category(db.Model):
    __tablename__ = 'categories'

    category_id  = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(100), nullable=False, unique=True)
    description  = db.Column(db.Text)
    date_created = db.Column(db.DateTime, default=datetime.utcnow) 

    # Relationship: A Category has many Products
    products = db.relationship('Product', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"

