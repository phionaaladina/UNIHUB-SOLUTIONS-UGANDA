from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.category import Category
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,HTTP_403_FORBIDDEN
)
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from app.models.user import User





category = Blueprint('categories', __name__, url_prefix='/api/v1/categories')


# Create a new category
@category.route('/create', methods=['POST'])
@jwt_required()
def create_category():
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '')

        if not name:
            return jsonify({'error': 'Category name is required'}), HTTP_400_BAD_REQUEST

        if Category.query.filter_by(name=name).first():
            return jsonify({'error': 'Category name already exists'}), HTTP_409_CONFLICT

        new_category = Category(name=name, description=description)
        db.session.add(new_category)
        db.session.commit()

        return jsonify({
            'message': 'Category created successfully',
            'category': {
                'id': new_category.category_id,
                'name': new_category.name,
                'description': new_category.description,
                'date_created': new_category.date_created
            }
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Get all categories
@category.route('/', methods=['GET'])
def get_all_categories():
    try:
        # Query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '')

        query = Category.query

        # Apply search filter if present
        if search:
            query = query.filter(Category.name.ilike(f"%{search}%"))

        # Apply pagination
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        result = [{
            'id': cat.category_id,
            'name': cat.name,
            'description': cat.description,
            'date_created': cat.date_created
        } for cat in paginated.items]

        return jsonify({
            'message': 'Categories retrieved',
            'total': paginated.total,
            'page': paginated.page,
            'pages': paginated.pages,
            'categories': result
        }), HTTP_200_OK

    except Exception as e:
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


    except Exception as e:
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Get a single category by ID
@category.route('/<int:id>', methods=['GET'])
def get_category(id):
    try:
        cat = Category.query.get_or_404(id)

        # Include all products under this category
        products_data = [{
            'id': product.product_id,
            'name': product.name,
            'price': product.price,
            'description': product.description
        } for product in cat.products]

        return jsonify({
            'id': cat.category_id,
            'name': cat.name,
            'description': cat.description,
            'date_created': cat.date_created,
            'products': products_data  # <-- Added
        }), HTTP_200_OK

    except Exception as e:
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR



# Update a category
@category.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    try:
        current_user = User.query.get(get_jwt_identity())
        if current_user.user_type not in ['admin', 'super_admin']:
            return jsonify({'error': 'Only admins can update categories'}), HTTP_403_FORBIDDEN

        cat = Category.query.get_or_404(id)
        data = request.get_json()

        cat.name = data.get('name', cat.name)
        cat.description = data.get('description', cat.description)

        db.session.commit()

        return jsonify({'message': 'Category updated successfully'}), HTTP_200_OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Delete a category
@category.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    try:
        current_user = User.query.get(get_jwt_identity())
        if current_user.user_type not in ['admin', 'super_admin']:
            return jsonify({'error': 'Only admins can delete categories'}), HTTP_403_FORBIDDEN

        cat = Category.query.get_or_404(id)
        db.session.delete(cat)
        db.session.commit()

        return jsonify({'message': 'Category deleted successfully'}), HTTP_200_OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR