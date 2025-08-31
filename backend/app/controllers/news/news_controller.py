from flask import Blueprint, request, jsonify
from app.models.news import News
from app.extensions import db
from datetime import datetime
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,HTTP_403_FORBIDDEN
)
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from app.models.user import User

news = Blueprint('news', __name__, url_prefix='/api/v1/news')


#CREATE NEWS
@news.route('/create', methods=['POST'])
@jwt_required()
def create_news():
    print("create_news route hit")
    data = request.get_json()
    print("Received JSON data:", data)
    author_id = get_jwt_identity()
  
    
    if isinstance(data, list):
        news_list = []
        for item in data:
            news = News(
                title=item['title'],
                content=item['content'],
                image_url=item.get('image_url'),
                author_id=author_id
            )
            db.session.add(news)
            news_list.append(news)
        db.session.commit()
        return jsonify({'message': f'{len(news_list)} news articles created successfully.'}), 201

    elif isinstance(data, dict):
        news = News(
            title=data['title'],
            content=data['content'],
            image_url=data.get('image_url'),
            author_id=author_id
        )
        db.session.add(news)
        db.session.commit()
        return jsonify({'message': 'News article created successfully.'}), 201

    return jsonify({'error': 'Invalid data format'}), 400


#BULK NEWS CREATE
@news.route('/bulk-create', methods=['POST'])
@jwt_required()
def create_bulk_news():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'error': 'Expected a list of news items'}), 400

    news_items = []
    for item in data:
        try:
            new_item = News(
                author_id=item['author_id'],
                title=item['title'],
                content=item['content'],
                image_url=item.get('image_url')
            )
            news_items.append(new_item)
        except KeyError as e:
            return jsonify({'error': f'Missing field {e.args[0]}'}), 400

    db.session.add_all(news_items)
    db.session.commit()

    return jsonify({'message': f'{len(news_items)} news items created successfully.'}), 201



# GET ALL NEWS
@news.route('/', methods=['GET'])
def get_news():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = News.query.order_by(News.date_posted.desc()).paginate(page=page, per_page=per_page, error_out=False)
    news_items = pagination.items

    result = []
    for item in news_items:
        result.append({
            'news_id': item.news_id,
            'title': item.title,
            'content': item.content,
            'image_url': item.image_url,
            'date_posted': item.date_posted.isoformat(),
            'author_id': item.author_id,
        })

    return jsonify({
        'news': result,
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
        'per_page': pagination.per_page
    }), 200


# GET NEWS BY ID
@news.route('/<int:news_id>', methods=['GET'])
def get_news_by_ID(news_id):
    news = News.query.get_or_404(news_id)
    return jsonify({
        'news_id': news.news_id,
        'title': news.title,
        'content': news.content,
        'image_url': news.image_url,
        'author_id': news.author_id,
        'date_posted': news.date_posted
    })

#UPDATE NEWS
@news.route('/update/<int:news_id>', methods=['PUT', 'PATCH'])
def update_news(news_id):
    news = News.query.get_or_404(news_id)
    data = request.get_json()
    news.title = data.get('title', news.title)
    news.content = data.get('content', news.content)
    news.image_url = data.get('image_url', news.image_url)
    db.session.commit()
    return jsonify({'message': 'News updated'})


#DELETE NEWS
@news.route('/delete/<int:news_id>', methods=['DELETE'])
def delete_news(news_id):
    news = News.query.get_or_404(news_id)
    db.session.delete(news)
    db.session.commit()
    return jsonify({'message': 'News deleted'})
