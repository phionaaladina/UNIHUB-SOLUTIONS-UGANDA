from app.extensions import db
from datetime import datetime


class Chat(db.Model):
    __tablename__ = 'chats'

    chat_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='chats', lazy=True)

    def __repr__(self):
        return f"<Chat {self.chat_id} by User {self.user_id}>"
