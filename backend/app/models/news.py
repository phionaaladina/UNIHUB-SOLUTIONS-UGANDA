
from app.extensions import db
from datetime import datetime


class News(db.Model):
    __tablename__ = 'news'

    news_id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship('User', backref='news', lazy=True)

    def __repr__(self):
        return f"<News {self.title} by User {self.author_id}>"
