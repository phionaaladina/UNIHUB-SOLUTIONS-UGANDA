from flask import Blueprint, request, jsonify
from app.models.orderItem import OrderItem
from app.models.order import Order
from app.models.product import Product
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.status_codes import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

order_item = Blueprint('order_item', __name__, url_prefix='/api/order_items')

# Get all items for a specific order
@order_item.route('/order/<int:order_id>', methods=['GET'])
@jwt_required()
def get_items_for_order(order_id):
    # Optional: Verify ownership of order if needed
    items = OrderItem.query.filter_by(order_id=order_id).all()
    if not items:
        return jsonify({'message': 'No items found for this order'}), HTTP_404_NOT_FOUND

    result = []
    for item in items:
        result.append({
            'order_item_id': item.order_item_id,
            'product_id': item.product_id,
            'quantity': item.quantity,
            'price': item.price,
            'product_name': item.product.name if item.product else None
        })

    return jsonify(result), HTTP_200_OK


# Create an order item (usually done inside order creation)
@order_item.route('/', methods=['POST'])
@jwt_required()
def create_order_item():
    data = request.get_json()
    order_id = data.get('order_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    price = data.get('price')

    if not all([order_id, product_id, quantity, price]):
        return jsonify({'error': 'Missing required fields'}), HTTP_400_BAD_REQUEST

    # Optional: Validate order exists and belongs to user

    # Optional: Validate product exists

    order_item = OrderItem(
        order_id=order_id,
        product_id=product_id,
        quantity=quantity,
        price=price
    )

    try:
        db.session.add(order_item)
        db.session.commit()
        return jsonify({'message': 'Order item created', 'order_item_id': order_item.order_item_id}), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Update an order item (e.g. change quantity)
@order_item.route('/<int:order_item_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_order_item(order_item_id):
    order_item = OrderItem.query.get_or_404(order_item_id)
    data = request.get_json()

    quantity = data.get('quantity', order_item.quantity)
    price = data.get('price', order_item.price)

    order_item.quantity = quantity
    order_item.price = price

    try:
        db.session.commit()
        return jsonify({'message': 'Order item updated'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Delete an order item
@order_item.route('/<int:order_item_id>', methods=['DELETE'])
@jwt_required()
def delete_order_item(order_item_id):
    order_item = OrderItem.query.get_or_404(order_item_id)
    try:
        db.session.delete(order_item)
        db.session.commit()
        return jsonify({'message': 'Order item deleted'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
