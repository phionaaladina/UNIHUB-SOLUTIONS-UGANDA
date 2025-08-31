from datetime import datetime
from app.extensions import db

class Discount(db.Model):
    __tablename__ = 'discounts'
    discount_id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    percentage = db.Column(db.Float, nullable=False)  # e.g., 10 for 10%
    is_active = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Discount {self.code} - {self.percentage}%>"