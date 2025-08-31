# app/blueprints/discount.py
from flask import Blueprint, request, jsonify
from app.models.discount import Discount
from app.extensions import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
)
import functools # <--- IMPORT THIS FOR functools.wraps

# Blueprint name changed to 'discount'
discount = Blueprint('discount', __name__, url_prefix='/api/v1/discounts')

# Helper to check admin role
def admin_required(fn):
    # Add @functools.wraps(fn) to preserve original function metadata
    @functools.wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user and (user.user_type == 'admin' or user.user_type == 'super_admin'):
            return fn(*args, **kwargs)
        else:
            return jsonify({"msg": "Admin or Super Admin access required"}), HTTP_403_FORBIDDEN
    return wrapper

# CREATE DISCOUNT
@discount.route('/', methods=['POST'])
@admin_required
def create_discount():
    data = request.get_json()
    code = data.get('code')
    percentage = data.get('percentage')
    is_active = data.get('is_active', True) # Default to true
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')

    if not code or percentage is None:
        return jsonify({'error': 'Code and percentage are required'}), HTTP_400_BAD_REQUEST

    if not isinstance(percentage, (int, float)) or not (0 < percentage <= 100):
        return jsonify({'error': 'Percentage must be a number between 0 and 100'}), HTTP_400_BAD_REQUEST

    # Check for existing code
    if Discount.query.filter_by(code=code).first():
        return jsonify({'error': 'Discount code already exists'}), HTTP_409_CONFLICT

    start_date = None
    if start_date_str:
        try:
            # datetime.fromisoformat can handle 'Z' if it's explicitly aware of UTC offsets
            # Using .replace('Z', '+00:00') is a robust way to ensure it works for common JS ISO strings
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid start_date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)'}), HTTP_400_BAD_REQUEST

    end_date = None
    if end_date_str:
        try:
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid end_date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)'}), HTTP_400_BAD_REQUEST

    if start_date and end_date and start_date > end_date:
        return jsonify({'error': 'Start date cannot be after end date'}), HTTP_400_BAD_REQUEST

    new_discount = Discount(
        code=code,
        percentage=percentage,
        is_active=is_active,
        start_date=start_date,
        end_date=end_date
    )

    try:
        db.session.add(new_discount)
        db.session.commit()
        return jsonify({'message': 'Discount created successfully', 'discount_id': new_discount.discount_id}), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        # Log the full exception for debugging in production
        print(f"Error creating discount: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# GET ALL DISCOUNTS (with pagination and optional search)
@discount.route('/', methods=['GET'])
@admin_required # Only admins can view all discounts
def get_all_discounts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search_query = request.args.get('search', type=str)
    is_active_filter = request.args.get('is_active', type=str) # 'true', 'false', or None

    query = Discount.query.order_by(Discount.created_at.desc())

    if search_query:
        query = query.filter(Discount.code.ilike(f'%{search_query}%'))

    if is_active_filter is not None:
        # Converts 'true'/'false' string to actual boolean True/False
        query = query.filter(Discount.is_active == (is_active_filter.lower() == 'true'))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    discounts = pagination.items

    result = []
    for discount_item in discounts: # Renamed loop variable to avoid conflict with blueprint name
        result.append({
            'discount_id': discount_item.discount_id,
            'code': discount_item.code,
            'percentage': discount_item.percentage,
            'is_active': discount_item.is_active,
            'start_date': discount_item.start_date.isoformat() if discount_item.start_date else None,
            'end_date': discount_item.end_date.isoformat() if discount_item.end_date else None,
            'created_at': discount_item.created_at.isoformat(),
            'updated_at': discount_item.updated_at.isoformat()
        })

    return jsonify({
        'discounts': result,
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
        'per_page': pagination.per_page
    }), HTTP_200_OK

# GET SINGLE DISCOUNT BY ID
@discount.route('/<int:discount_id>', methods=['GET'])
@admin_required
def get_discount(discount_id):
    discount_item = Discount.query.get(discount_id) # Renamed variable for clarity
    if not discount_item:
        return jsonify({'error': 'Discount not found'}), HTTP_404_NOT_FOUND

    return jsonify({
        'discount_id': discount_item.discount_id,
        'code': discount_item.code,
        'percentage': discount_item.percentage,
        'is_active': discount_item.is_active,
        'start_date': discount_item.start_date.isoformat() if discount_item.start_date else None,
        'end_date': discount_item.end_date.isoformat() if discount_item.end_date else None,
        'created_at': discount_item.created_at.isoformat(),
        'updated_at': discount_item.updated_at.isoformat()
    }), HTTP_200_OK

# UPDATE DISCOUNT
@discount.route('/<int:discount_id>', methods=['PUT', 'PATCH'])
@admin_required
def update_discount(discount_id):
    discount_item = Discount.query.get(discount_id) # Renamed variable for clarity
    if not discount_item:
        return jsonify({'error': 'Discount not found'}), HTTP_404_NOT_FOUND

    data = request.get_json()

    new_code = data.get('code')
    if new_code and new_code != discount_item.code:
        # Check if new code already exists for another discount
        if Discount.query.filter(Discount.code == new_code, Discount.discount_id != discount_id).first():
            return jsonify({'error': 'New discount code already exists'}), HTTP_409_CONFLICT
        discount_item.code = new_code

    if 'percentage' in data: # Check if key exists, even if value is None
        percentage = data.get('percentage')
        if not isinstance(percentage, (int, float)) or not (0 < percentage <= 100):
            return jsonify({'error': 'Percentage must be a number between 0 and 100'}), HTTP_400_BAD_REQUEST
        discount_item.percentage = percentage

    if 'is_active' in data: # Check if key exists
        discount_item.is_active = bool(data.get('is_active'))

    if 'start_date' in data: # Check if key exists
        start_date_str = data.get('start_date')
        if start_date_str:
            try:
                discount_item.start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid start_date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)'}), HTTP_400_BAD_REQUEST
        else:
            discount_item.start_date = None # Allow clearing the date by sending null/empty string

    if 'end_date' in data: # Check if key exists
        end_date_str = data.get('end_date')
        if end_date_str:
            try:
                discount_item.end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid end_date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)'}), HTTP_400_BAD_REQUEST
        else:
            discount_item.end_date = None # Allow clearing the date by sending null/empty string

    # Re-validate date range after potential updates
    if discount_item.start_date and discount_item.end_date and discount_item.start_date > discount_item.end_date:
        return jsonify({'error': 'Start date cannot be after end date'}), HTTP_400_BAD_REQUEST

    try:
        db.session.commit()
        return jsonify({'message': 'Discount updated successfully'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error updating discount {discount_id}: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# DELETE DISCOUNT
@discount.route('/<int:discount_id>', methods=['DELETE'])
@admin_required
def delete_discount(discount_id):
    discount_item = Discount.query.get(discount_id) # Renamed variable for clarity
    if not discount_item:
        return jsonify({'error': 'Discount not found'}), HTTP_404_NOT_FOUND

    try:
        db.session.delete(discount_item)
        db.session.commit()
        return jsonify({'message': 'Discount deleted successfully'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting discount {discount_id}: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR