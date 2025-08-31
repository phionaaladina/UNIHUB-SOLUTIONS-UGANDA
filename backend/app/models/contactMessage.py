# app/models/contactMessage.py
from app.extensions import db
from datetime import datetime
# from app.models.user import User # Uncomment this if you intend to create a relationship to the User model


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages' # Explicitly define table name

    contact_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date_sent = db.Column(db.DateTime, default=datetime.utcnow, nullable=False) # Added nullable=False for consistency

    # --- NEW FIELDS FOR ADMIN TRACKING ---
    status = db.Column(db.String(50), default='pending', nullable=False) # e.g., 'pending', 'replied', 'archived'
    replied_at = db.Column(db.DateTime, nullable=True) # Timestamp when the message was replied to
    replied_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # ID of the admin who replied

    # Optional: Define relationship to User model if you added replied_by_user_id
    # replier = db.relationship('User', backref='replied_contact_messages', lazy=True)


    def __repr__(self):
        return f"<ContactMessage from {self.name} (ID: {self.contact_id})>"













# from app.extensions import db
# from datetime import datetime



# class ContactMessage(db.Model):
#     __tablename__ = 'contact_messages'

#     contact_id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(120), nullable=False)
#     message = db.Column(db.Text, nullable=False)
#     date_sent = db.Column(db.DateTime, default=datetime.utcnow)

#     def __repr__(self):
#         return f"<ContactMessage from {self.name}>"
