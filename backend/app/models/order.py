
# # app/models/order.py
# from app.extensions import db
# from datetime import datetime # Make sure datetime is imported here

# class Order(db.Model):
#     __tablename__ = 'orders'

#     order_id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     status = db.Column(db.String(50), default='pending')
#     total_amount = db.Column(db.Float, nullable=False)

#     # ADD THESE TWO COLUMNS
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


#     # Relationship
#     user = db.relationship('User', backref=db.backref('orders', lazy=True)) # Added backref with lazy=True for consistency
#     items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan") # Added cascade for robust deletion
#     sale = db.relationship('Sale', backref='order', uselist=False)

#     def __repr__(self):
#         return f"<Order {self.order_id} - User {self.user_id}>"


#right up up













# # app/models/order.py
# from app.extensions import db
# from datetime import datetime # Make sure datetime is imported here

# class Order(db.Model):
#     __tablename__ = 'orders'

#     order_id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     status = db.Column(db.String(50), default='pending')
#     total_amount = db.Column(db.Float, nullable=False)

#     # Existing timestamp columns
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # NEW CUSTOMER INFORMATION FIELDS
#     customer_name = db.Column(db.String(100), nullable=True)  # Will be populated during checkout
#     customer_email = db.Column(db.String(100), nullable=True)
#     customer_phone = db.Column(db.String(20), nullable=True)
#     delivery_address = db.Column(db.Text, nullable=True)
#     city = db.Column(db.String(50), nullable=True)
#     payment_method = db.Column(db.String(20), default='cod')  # 'cod' or 'momo'
#     momo_number = db.Column(db.String(20), nullable=True)  # For mobile money payments
#     momo_network = db.Column(db.String(10), nullable=True)  # 'mtn' or 'airtel'
#     special_notes = db.Column(db.Text, nullable=True)

#     # Existing relationships
#     user = db.relationship('User', backref=db.backref('orders', lazy=True)) # Added backref with lazy=True for consistency
#     items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan") # Added cascade for robust deletion
#     sale = db.relationship('Sale', backref='order', uselist=False)

#     def __repr__(self):
#         return f"<Order {self.order_id} - User {self.user_id}>"

#     def to_dict(self):
#         """Convert order to dictionary for API responses"""
#         return {
#             'order_id': self.order_id,
#             'user_id': self.user_id,
#             'status': self.status,
#             'total_amount': self.total_amount,
#             'created_at': self.created_at.isoformat() if self.created_at else None,
#             'updated_at': self.updated_at.isoformat() if self.updated_at else None,
#             'customer_name': self.customer_name,
#             'customer_email': self.customer_email,
#             'customer_phone': self.customer_phone,
#             'delivery_address': self.delivery_address,
#             'city': self.city,
#             'payment_method': self.payment_method,
#             'momo_number': self.momo_number,
#             'momo_network': self.momo_network,
#             'special_notes': self.special_notes,
#             'items': [item.to_dict() for item in self.items] if hasattr(self, 'items') else []
#         }

 


from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Changed to nullable=True for guest orders
    status = db.Column(db.String(50), default='pending')
    total_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    customer_name = db.Column(db.String(100), nullable=True)
    customer_email = db.Column(db.String(100), nullable=True)
    customer_phone = db.Column(db.String(20), nullable=True)
    delivery_address = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(50), nullable=True)
    payment_method = db.Column(db.String(20), default='cod')
    momo_number = db.Column(db.String(20), nullable=True)
    momo_network = db.Column(db.String(10), nullable=True)
    special_notes = db.Column(db.Text, nullable=True)
    payment_proof_url = db.Column(db.String(255), nullable=True)  # Added for payment proof

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")
    sale = db.relationship('Sale', backref='order', uselist=False)

    def __repr__(self):
        return f"<Order {self.order_id} - User {self.user_id}>"

    def to_dict(self):
        return {
            'order_id': self.order_id,
            'user_id': self.user_id,
            'status': self.status,
            'total_amount': self.total_amount,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'delivery_address': self.delivery_address,
            'city': self.city,
            'payment_method': self.payment_method,
            'momo_number': self.momo_number,
            'momo_network': self.momo_network,
            'special_notes': self.special_notes,
            'payment_proof_url': self.payment_proof_url,  # Added to to_dict
            'items': [item.to_dict() for item in self.items] if hasattr(self, 'items') else []
        }