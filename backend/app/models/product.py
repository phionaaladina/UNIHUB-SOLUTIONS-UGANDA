from app.extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    product_id   = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    name         = db.Column(db.String(150), nullable=False, unique=True)
    brand = db.Column(db.String(100))
    description  = db.Column(db.Text)
    price        = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    

    # Foreign key to Category
    category_id = db.Column(db.Integer,db.ForeignKey('categories.category_id', ondelete='CASCADE'),nullable=False)


    def __repr__(self):
        return f"<Product {self.name} - Category ID {self.category_id}>"

