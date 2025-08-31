# # # from flask import Blueprint, request, jsonify
# # # from app.extensions import db
# # # from app.models.cart import Cart
# # # from app.models.discount import Discount
# # # from app.models.product import Product
# # # from app.models.user import User
# # # from flask_jwt_extended import jwt_required, get_jwt_identity
# # # from datetime import datetime

# # # cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')


# # # @cart.route('/', methods=['GET'])
# # # @jwt_required()
# # # def view_cart():
# # #     user_id = get_jwt_identity()
# # #     cart_items = Cart.query.filter_by(user_id=user_id).all()

# # #     if not cart_items:
# # #         return jsonify({'message': 'Cart is empty.'}), 200

# # #     cart = []
# # #     total = 0
# # #     for item in cart_items:
# # #         item_total = item.quantity * item.price
# # #         total += item_total
# # #         cart.append({
# # #             'product_id': item.product_id,
# # #             'product_name': item.product.name,
# # #             'quantity': item.quantity,
# # #             'price': item.price,
# # #             'total': item_total
# # #         })

# # #     return jsonify({'cart': cart, 'total': total}), 200


# # # @cart.route('/add', methods=['POST'])
# # # @jwt_required()
# # # def add_to_cart():
# # #     data = request.get_json()
# # #     product_id = data.get('product_id')
# # #     quantity = data.get('quantity', 1)
# # #     user_id = get_jwt_identity()

# # #     product = Product.query.get(product_id)
# # #     if not product:
# # #         return jsonify({'message': 'Product not found'}), 404

# # #     cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

# # #     if cart_item:
# # #         cart_item.quantity += quantity
# # #     else:
# # #         cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity, price=product.price)
# # #         db.session.add(cart_item)

# # #     db.session.commit()
# # #     return jsonify({'message': 'Item added to cart'}), 201


# # # @cart.route('/update/<int:product_id>', methods=['PUT'])
# # # @jwt_required()
# # # def update_quantity(product_id):
# # #     data = request.get_json()
# # #     quantity = data.get('quantity')
# # #     user_id = get_jwt_identity()

# # #     cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
# # #     if not cart_item:
# # #         return jsonify({'message': 'Item not found in cart'}), 404

# # #     cart_item.quantity = quantity
# # #     db.session.commit()
# # #     return jsonify({'message': 'Quantity updated'}), 200


# # # @cart.route('/remove/<int:product_id>', methods=['DELETE'])
# # # @jwt_required()
# # # def remove_item(product_id):
# # #     user_id = get_jwt_identity()
# # #     cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

# # #     if not cart_item:
# # #         return jsonify({'message': 'Item not found in cart'}), 404

# # #     db.session.delete(cart_item)
# # #     db.session.commit()
# # #     return jsonify({'message': 'Item removed'}), 200


# # # @cart.route('/apply-discount', methods=['POST'])
# # # @jwt_required()
# # # def apply_discount():
# # #     data = request.get_json()
# # #     discount_code = data.get('discount_code')
# # #     user_id = get_jwt_identity()

# # #     discount = Discount.query.filter_by(code=discount_code).first()
# # #     if not discount:
# # #         return jsonify({'message': 'Invalid discount code'}), 404

# # #     cart_items = Cart.query.filter_by(user_id=user_id).all()
# # #     for item in cart_items:
# # #         item.discount_id = discount.id
# # #     db.session.commit()

# # #     return jsonify({'message': 'Discount applied'}), 200


# # # @cart.route('/checkout', methods=['POST'])
# # # @jwt_required()
# # # def checkout():
# # #     user_id = get_jwt_identity()
# # #     cart_items = Cart.query.filter_by(user_id=user_id).all()

# # #     if not cart_items:
# # #         return jsonify({'message': 'Cart is empty'}), 400

# # #     total = 0
# # #     for item in cart_items:
# # #         subtotal = item.quantity * item.price
# # #         if item.discount:
# # #             subtotal -= subtotal * (item.discount.percentage / 100)
# # #         total += subtotal

# # #     # You can extend this with order creation
# # #     Cart.query.filter_by(user_id=user_id).delete()
# # #     db.session.commit()

# # #     return jsonify({'message': 'Checkout successful', 'total_paid': total}), 200



# # # from flask import Blueprint, request, jsonify
# # # from app.extensions import db
# # # from app.models.cart import Cart, CartItem
# # # from app.models.product import Product
# # # from flask_jwt_extended import jwt_required, get_jwt_identity
# # # from app.status_codes import (
# # #     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
# # #     HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,HTTP_403_FORBIDDEN
# # # )

# # # from datetime import datetime
# # # from app.models.order import Order
# # # from app.models.orderItem import OrderItem
# # # cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')


# # # @cart.route('/', methods=['GET'])
# # # @jwt_required()
# # # def view_cart():
# # #     user_id = get_jwt_identity()
# # #     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()

# # #     if not active_cart or not active_cart.items:
# # #         return jsonify({'message': 'Cart is empty.', 'cart': [], 'total': 0}), 200

# # #     cart_list = []
# # #     total = 0
# # #     for item in active_cart.items:
# # #         item_total = item.quantity * item.product.price
# # #         total += item_total
# # #         cart_list.append({
# # #             'cart_item_id': item.cart_item_id,
# # #             'product_id': item.product_id,
# # #             'product_name': item.product.name,
# # #             'quantity': item.quantity,
# # #             'price': item.product.price,
# # #             'total': item_total
# # #         })

# # #     return jsonify({'cart': cart_list, 'total': total}), 200

# # # # Create a new cart item
# # # @cart.route('/add', methods=['POST'])
# # # @jwt_required()
# # # def add_to_cart():
# # #     data = request.get_json()
# # #     product_id = data.get('product_id')
# # #     quantity = data.get('quantity', 1)
# # #     user_id = get_jwt_identity()

# # #     product = Product.query.get(product_id)
# # #     if not product:
# # #         return jsonify({'message': 'Product not found'}), 404

# # #     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
# # #     if not active_cart:
# # #         active_cart = Cart(user_id=user_id)
# # #         db.session.add(active_cart)
# # #         db.session.commit()

# # #     cart_item = CartItem.query.filter_by(cart_id=active_cart.cart_id, product_id=product_id).first()

# # #     if cart_item:
# # #         cart_item.quantity += quantity
# # #     else:
# # #         cart_item = CartItem(cart_id=active_cart.cart_id, product_id=product_id, quantity=quantity)
# # #         db.session.add(cart_item)

# # #     db.session.commit()
# # #     return jsonify({'message': 'Item added to cart'}), 201


# # # #update a cart item quantity
# # # @cart.route('/update/<int:cart_item_id>', methods=['PUT', 'PATCH'])
# # # @jwt_required()
# # # def update_quantity(cart_item_id):
# # #     data = request.get_json()
# # #     quantity = data.get('quantity')
# # #     user_id = get_jwt_identity()

# # #     cart_item = CartItem.query.join(Cart).filter(
# # #         Cart.user_id == user_id,
# # #         CartItem.cart_item_id == cart_item_id
# # #     ).first()

# # #     if not cart_item:
# # #         return jsonify({'message': 'Cart item not found'}), 404

# # #     cart_item.quantity = quantity
# # #     db.session.commit()
# # #     return jsonify({'message': 'Quantity updated'}), 200


# # # #Delete A cart item
# # # @cart.route('/remove/<int:cart_item_id>', methods=['DELETE'])
# # # @jwt_required()
# # # def remove_item(cart_item_id):
# # #     user_id = get_jwt_identity()
# # #     cart_item = CartItem.query.join(Cart).filter(
# # #         Cart.user_id == user_id,
# # #         CartItem.cart_item_id == cart_item_id
# # #     ).first()

# # #     if not cart_item:
# # #         return jsonify({'message': 'Cart item not found'}), 404

# # #     db.session.delete(cart_item)
# # #     db.session.commit()
# # #     return jsonify({'message': 'Item removed'}), 200



# # # @cart.route('/checkout', methods=['POST'])
# # # @jwt_required()
# # # def checkout():
# # #     user_id = get_jwt_identity()

# # #     cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
# # #     if not cart or not cart.items:
# # #         return jsonify({'error': 'Cart is empty'}), HTTP_400_BAD_REQUEST

# # #     try:
# # #         total = 0
# # #         new_order = Order(user_id=user_id, status='pending', total_amount=0, order_date=datetime.utcnow())
# # #         db.session.add(new_order)
# # #         db.session.flush()  # Get order_id

# # #         for item in cart.items:
# # #             price = item.product.price  # Always get latest product price
# # #             total += item.quantity * price

# # #             order_item = OrderItem(
# # #                 order_id=new_order.order_id,
# # #                 product_id=item.product_id,
# # #                 quantity=item.quantity,
# # #                 price=price
# # #             )
# # #             db.session.add(order_item)

# # #         new_order.total_amount = total

# # #         # Clear or deactivate cart
# # #         cart.is_active = False
# # #         db.session.commit()

# # #         return jsonify({
# # #             'message': 'Order placed successfully',
# # #             'order_id': new_order.order_id,
# # #             'total_paid': total
# # #         }), HTTP_201_CREATED

# # #     except Exception as e:
# # #         db.session.rollback()
# # #         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # from flask import Blueprint, request, jsonify
# # from app.extensions import db
# # from app.models.cart import Cart, CartItem
# # from app.models.product import Product
# # from flask_jwt_extended import jwt_required, get_jwt_identity
# # from app.status_codes import (
# #     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
# #     HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
# # )
# # from datetime import datetime
# # from app.models.order import Order
# # from app.models.orderItem import OrderItem

# # cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')


# # @cart.route('/', methods=['GET'])
# # @jwt_required()
# # def view_cart():
# #     user_id = get_jwt_identity()
# #     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()

# #     if not active_cart or not active_cart.items:
# #         return jsonify({'message': 'Cart is empty.', 'cart': [], 'total': 0}), HTTP_200_OK

# #     cart_list = []
# #     total = 0
# #     for item in active_cart.items:
# #         item_total = item.quantity * item.product.price
# #         total += item_total
# #         cart_list.append({
# #             'cart_item_id': item.cart_item_id,
# #             'product_id': item.product_id,
# #             'product_name': item.product.name,
# #             'quantity': item.quantity,
# #             'price': item.product.price,
# #             'total': item_total
# #         })

# #     return jsonify({'cart': cart_list, 'total': total}), HTTP_200_OK


# # @cart.route('/add', methods=['POST'])
# # @jwt_required()
# # def add_to_cart():
# #       # Add this line first
# #     print(f"DEBUG: Raw request.data: {request.data}")
# #     print(f"DEBUG: Raw request.json: {request.json}")
# #     data = request.get_json()
# #     product_id = data.get('product_id')
# #     quantity = data.get('quantity', 1)
# #     user_id = get_jwt_identity()

# #     product = Product.query.get(product_id)
# #     if not product:
# #         return jsonify({'message': 'Product not found'}), HTTP_404_NOT_FOUND

# #     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
# #     if not active_cart:
# #         active_cart = Cart(user_id=user_id)
# #         db.session.add(active_cart)
# #         db.session.commit()

# #     cart_item = CartItem.query.filter_by(cart_id=active_cart.cart_id, product_id=product_id).first()

# #     if cart_item:
# #         cart_item.quantity += quantity
# #     else:
# #         cart_item = CartItem(cart_id=active_cart.cart_id, product_id=product_id, quantity=quantity)
# #         db.session.add(cart_item)

# #     db.session.commit()
# #     return jsonify({'message': 'Item added to cart'}), HTTP_201_CREATED


# # @cart.route('/update/<int:cart_item_id>', methods=['PUT', 'PATCH'])
# # @jwt_required()
# # def update_quantity(cart_item_id):
# #     data = request.get_json()
# #     quantity = data.get('quantity')
# #     user_id = get_jwt_identity()

# #     cart_item = CartItem.query.join(Cart).filter(
# #         Cart.user_id == user_id,
# #         CartItem.cart_item_id == cart_item_id
# #     ).first()

# #     if not cart_item:
# #         return jsonify({'message': 'Cart item not found'}), HTTP_404_NOT_FOUND

# #     cart_item.quantity = quantity
# #     db.session.commit()
# #     return jsonify({'message': 'Quantity updated'}), HTTP_200_OK


# # @cart.route('/remove/<int:cart_item_id>', methods=['DELETE'])
# # @jwt_required()
# # def remove_item(cart_item_id):
# #     user_id = get_jwt_identity()
# #     cart_item = CartItem.query.join(Cart).filter(
# #         Cart.user_id == user_id,
# #         CartItem.cart_item_id == cart_item_id
# #     ).first()

# #     if not cart_item:
# #         return jsonify({'message': 'Cart item not found'}), HTTP_404_NOT_FOUND

# #     db.session.delete(cart_item)
# #     db.session.commit()
# #     return jsonify({'message': 'Item removed'}), HTTP_200_OK


# # # @cart.route('/checkout', methods=['POST'])
# # # @jwt_required()
# # # def checkout():
# # #     user_id = get_jwt_identity()
# # #     cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()

# # #     if not cart or not cart.items:
# # #         return jsonify({'error': 'Cart is empty'}), HTTP_400_BAD_REQUEST

# # #     try:
# # #         total = 0
# # #         new_order = Order(user_id=user_id, status='pending', total_amount=0, created_at=datetime.utcnow())
# # #         db.session.add(new_order)
# # #         db.session.flush()  # Ensure order_id is available

# # #         for item in cart.items:
# # #             price = item.product.price
# # #             total += item.quantity * price

# # #             order_item = OrderItem(
# # #                 order_id=new_order.order_id,
# # #                 product_id=item.product_id,
# # #                 quantity=item.quantity,
# # #                 price=price
# # #             )
# # #             db.session.add(order_item)

# # #         new_order.total_amount = total
# # #         cart.is_active = False
# # #         db.session.commit()

# # #         return jsonify({
# # #             'message': 'Order placed successfully',
# # #             'order_id': new_order.order_id,
# # #             'total_paid': total
# # #         }), HTTP_201_CREATED

# # #     except Exception as e:
# # #         db.session.rollback()
# # #         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR



    
# # #     # # Create Order and OrderItems
# # #     # from app.models.cart import Order, OrderItem  # Import here to avoid circular imports

# # #     # order = Order(user_id=user_id, total_price=total)
# # #     # db.session.add(order)
# # #     # db.session.commit()  # Commit so order_id is generated

# # #     # for item in active_cart.items:
# # #     #     order_item = OrderItem(
# # #     #         order_id=order.order_id,
# # #     #         product_id=item.product_id,
# # #     #         quantity=item.quantity,
# # #     #         price=item.product.price
# # #     #     )
# # #     #     db.session.add(order_item)

# # #     # Clear cart (deactivate it)
# # #     active_cart.is_active = False

# # #     db.session.commit()

# # #     return jsonify({'message': 'Checkout successful', 'order_id': order.order_id, 'total_paid': total}), 200
# # # Checkout a specific cart item
# # @cart.route('/checkout/<int:cart_item_id>', methods=['POST'])
# # @jwt_required()
# # def checkout(cart_item_id):
# #     user_id = get_jwt_identity()

# #     # Join CartItem with Cart to access user_id via the cart relationship
# #     cart_item = db.session.query(CartItem).join(Cart).filter(
# #         CartItem.cart_item_id == cart_item_id,
# #         Cart.user_id == user_id
# #     ).first()

# #     if not cart_item:
# #         return jsonify({'error': 'Cart item not found'}), HTTP_404_NOT_FOUND

# #     try:
# #         # Access price from the product relation
# #         product_price = cart_item.product.price
# #         total = product_price * cart_item.quantity

# #         # Create an Order
# #         order = Order(user_id=user_id, status='pending', total_amount=total)
# #         db.session.add(order)
# #         db.session.flush()  # To get order.order_id

# #         # Create OrderItem
# #         order_item = OrderItem(
# #             order_id=order.order_id,
# #             product_id=cart_item.product_id,
# #             quantity=cart_item.quantity,
# #             price=product_price
# #         )
# #         db.session.add(order_item)

# #         # Remove the item from the cart
# #         db.session.delete(cart_item)

# #         db.session.commit()
# #         return jsonify({
# #             'message': 'Checkout successful',
# #             'order_id': order.order_id
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # # Add this to your cart.py file

# # @cart.route('/checkout', methods=['POST'])
# # @jwt_required()
# # def checkout_full_cart():
# #     """Checkout the entire cart with customer information"""
# #     user_id = get_jwt_identity()
# #     data = request.get_json()
    
# #     # Extract customer info and cart data from frontend
# #     customer_info = data.get('customerInfo', {})
# #     cart_items = data.get('cart', [])
# #     frontend_total = data.get('total', 0)
    
# #     print(f"DEBUG: Received checkout data: {data}")
    
# #     # Validate required customer information
# #     required_fields = ['name', 'email', 'phone']
# #     for field in required_fields:
# #         if not customer_info.get(field):
# #             return jsonify({
# #                 'success': False,
# #                 'error': f'Missing required field: {field}'
# #             }), HTTP_400_BAD_REQUEST
    
# #     # Get user's active cart from database
# #     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
    
# #     if not active_cart or not active_cart.items:
# #         return jsonify({
# #             'success': False,
# #             'error': 'Cart is empty'
# #         }), HTTP_400_BAD_REQUEST

# #     try:
# #         total = 0
# #         # Create new order
# #         new_order = Order(
# #             user_id=user_id, 
# #             status='pending', 
# #             total_amount=0,
# #             # Store customer information in order (you might need to add these fields to your Order model)
# #             customer_name=customer_info.get('name'),
# #             customer_email=customer_info.get('email'),
# #             customer_phone=customer_info.get('phone'),
# #             delivery_address=customer_info.get('address', ''),
# #             city=customer_info.get('city', ''),
# #             payment_method=customer_info.get('paymentMethod', 'cod'),
# #             special_notes=customer_info.get('notes', ''),
# #             created_at=datetime.utcnow()
# #         )
# #         db.session.add(new_order)
# #         db.session.flush()  # Get order_id

# #         # Create order items from cart
# #         for item in active_cart.items:
# #             price = item.product.price  # Get current product price
# #             item_total = item.quantity * price
# #             total += item_total

# #             order_item = OrderItem(
# #                 order_id=new_order.order_id,
# #                 product_id=item.product_id,
# #                 quantity=item.quantity,
# #                 price=price
# #             )
# #             db.session.add(order_item)

# #         # Update order total
# #         new_order.total_amount = total
        
# #         # Clear cart by deactivating it
# #         active_cart.is_active = False
        
# #         db.session.commit()

# #         return jsonify({
# #             'success': True,
# #             'message': 'Order placed successfully',
# #             'order_id': new_order.order_id,
# #             'total': total
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Checkout error: {str(e)}")
# #         return jsonify({
# #             'success': False,
# #             'error': 'Failed to process order. Please try again.'
# #         }), HTTP_500_INTERNAL_SERVER_ERROR








# #last
# from flask import Blueprint, request, jsonify
# from app.extensions import db
# from app.models.cart import Cart, CartItem
# from app.models.product import Product
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
# )
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem

# cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')


# @cart.route('/', methods=['GET'])
# @jwt_required()
# def view_cart():
#     user_id = get_jwt_identity()
#     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()

#     if not active_cart or not active_cart.items:
#         return jsonify({'message': 'Cart is empty.', 'cart': [], 'total': 0}), HTTP_200_OK

#     cart_list = []
#     total = 0
#     for item in active_cart.items:
#         item_total = item.quantity * item.product.price
#         total += item_total
#         cart_list.append({
#             'cart_item_id': item.cart_item_id,
#             'product_id': item.product_id,
#             'product_name': item.product.name,
#             'quantity': item.quantity,
#             'price': item.product.price,
#             'total': item_total
#         })

#     return jsonify({'cart': cart_list, 'total': total}), HTTP_200_OK


# @cart.route('/add', methods=['POST'])
# @jwt_required()
# def add_to_cart():
#     print(f"DEBUG: Raw request.data: {request.data}")
#     print(f"DEBUG: Raw request.json: {request.json}")
#     data = request.get_json()
#     product_id = data.get('product_id')
#     quantity = data.get('quantity', 1)
#     user_id = get_jwt_identity()

#     product = Product.query.get(product_id)
#     if not product:
#         return jsonify({'message': 'Product not found'}), HTTP_404_NOT_FOUND

#     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
#     if not active_cart:
#         active_cart = Cart(user_id=user_id)
#         db.session.add(active_cart)
#         db.session.commit()

#     cart_item = CartItem.query.filter_by(cart_id=active_cart.cart_id, product_id=product_id).first()

#     if cart_item:
#         cart_item.quantity += quantity
#     else:
#         cart_item = CartItem(cart_id=active_cart.cart_id, product_id=product_id, quantity=quantity)
#         db.session.add(cart_item)

#     db.session.commit()
#     return jsonify({'message': 'Item added to cart'}), HTTP_201_CREATED


# @cart.route('/update/<int:cart_item_id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_quantity(cart_item_id):
#     data = request.get_json()
#     quantity = data.get('quantity')
#     user_id = get_jwt_identity()

#     cart_item = CartItem.query.join(Cart).filter(
#         Cart.user_id == user_id,
#         CartItem.cart_item_id == cart_item_id
#     ).first()

#     if not cart_item:
#         return jsonify({'message': 'Cart item not found'}), HTTP_404_NOT_FOUND

#     cart_item.quantity = quantity
#     db.session.commit()
#     return jsonify({'message': 'Quantity updated'}), HTTP_200_OK


# @cart.route('/remove/<int:cart_item_id>', methods=['DELETE'])
# @jwt_required()
# def remove_item(cart_item_id):
#     user_id = get_jwt_identity()
#     cart_item = CartItem.query.join(Cart).filter(
#         Cart.user_id == user_id,
#         CartItem.cart_item_id == cart_item_id
#     ).first()

#     if not cart_item:
#         return jsonify({'message': 'Cart item not found'}), HTTP_404_NOT_FOUND

#     db.session.delete(cart_item)
#     db.session.commit()
#     return jsonify({'message': 'Item removed'}), HTTP_200_OK


# # MAIN CHECKOUT ENDPOINT - For full cart checkout
# @cart.route('/checkout', methods=['POST'])
# @jwt_required()
# def checkout_full_cart():
#     """Checkout the entire cart with customer information"""
#     user_id = get_jwt_identity()
#     data = request.get_json()
    
#     print(f"DEBUG: Received checkout data: {data}")
    
#     # Extract customer info and cart data from frontend
#     customer_info = data.get('customerInfo', {})
#     cart_items = data.get('cart', [])
#     frontend_total = data.get('total', 0)
    
#     # Validate required customer information
#     required_fields = ['name', 'email', 'phone']
#     for field in required_fields:
#         if not customer_info.get(field):
#             return jsonify({
#                 'success': False,
#                 'error': f'Missing required field: {field}'
#             }), HTTP_400_BAD_REQUEST
    
#     # Get user's active cart from database
#     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
    
#     if not active_cart or not active_cart.items:
#         return jsonify({
#             'success': False,
#             'error': 'Cart is empty'
#         }), HTTP_400_BAD_REQUEST

#     try:
#         total = 0
#         # Create new order
#         new_order = Order(
#             user_id=user_id, 
#             status='pending', 
#             total_amount=0,
#             created_at=datetime.utcnow()
#         )
        
#         # Add customer information fields if they exist in your Order model
#         if hasattr(new_order, 'customer_name'):
#             new_order.customer_name = customer_info.get('name')
#             new_order.customer_email = customer_info.get('email')
#             new_order.customer_phone = customer_info.get('phone')
#             new_order.delivery_address = customer_info.get('address', '')
#             new_order.city = customer_info.get('city', '')
#             new_order.payment_method = customer_info.get('paymentMethod', 'cod')
#             new_order.special_notes = customer_info.get('notes', '')
#             if customer_info.get('paymentMethod') == 'momo':
#                 new_order.momo_number = customer_info.get('momoNumber', '')
#                 new_order.momo_network = customer_info.get('momoNetwork', '')
        
#         db.session.add(new_order)
#         db.session.flush()  # Get order_id

#         # Create order items from cart
#         for item in active_cart.items:
#             price = item.product.price  # Get current product price
#             item_total = item.quantity * price
#             total += item_total

#             order_item = OrderItem(
#                 order_id=new_order.order_id,
#                 product_id=item.product_id,
#                 quantity=item.quantity,
#                 price=price
#             )
#             db.session.add(order_item)

#         # Update order total
#         new_order.total_amount = total
        
#         # Clear cart by deactivating it
#         active_cart.is_active = False
        
#         db.session.commit()

#         return jsonify({
#             'success': True,
#             'message': 'Order placed successfully',
#             'order_id': new_order.order_id,
#             'total': total
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         print(f"Checkout error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': f'Failed to process order: {str(e)}'
#         }), HTTP_500_INTERNAL_SERVER_ERROR


# # INDIVIDUAL ITEM CHECKOUT - Renamed route to avoid conflict
# @cart.route('/checkout/item/<int:cart_item_id>', methods=['POST'])
# @jwt_required()
# def checkout_single_item(cart_item_id):
#     """Checkout a specific cart item"""
#     user_id = get_jwt_identity()

#     # Join CartItem with Cart to access user_id via the cart relationship
#     cart_item = db.session.query(CartItem).join(Cart).filter(
#         CartItem.cart_item_id == cart_item_id,
#         Cart.user_id == user_id
#     ).first()

#     if not cart_item:
#         return jsonify({'error': 'Cart item not found'}), HTTP_404_NOT_FOUND

#     try:
#         # Access price from the product relation
#         product_price = cart_item.product.price
#         total = product_price * cart_item.quantity

#         # Create an Order
#         order = Order(user_id=user_id, status='pending', total_amount=total, created_at=datetime.utcnow())
#         db.session.add(order)
#         db.session.flush()  # To get order.order_id

#         # Create OrderItem
#         order_item = OrderItem(
#             order_id=order.order_id,
#             product_id=cart_item.product_id,
#             quantity=cart_item.quantity,
#             price=product_price
#         )
#         db.session.add(order_item)

#         # Remove the item from the cart
#         db.session.delete(cart_item)

#         db.session.commit()
#         return jsonify({
#             'success': True,
#             'message': 'Checkout successful',
#             'order_id': order.order_id,
#             'total': total
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), HTTP_500_INTERNAL_SERVER_ERROR













#NOW


# from flask import Blueprint, request, jsonify
# from app.extensions import db
# from app.models.cart import Cart, CartItem
# from app.models.product import Product
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
# )
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem

# cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')


# @cart.route('/', methods=['GET'])
# @jwt_required()
# def view_cart():
#     user_id = get_jwt_identity()
#     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()

#     if not active_cart or not active_cart.items:
#         return jsonify({'message': 'Cart is empty.', 'cart': [], 'total': 0}), HTTP_200_OK

#     cart_list = []
#     total = 0
#     for item in active_cart.items:
#         item_total = item.quantity * item.product.price
#         total += item_total
#         cart_list.append({
#             'cart_item_id': item.cart_item_id,
#             'product_id': item.product_id,
#             'product_name': item.product.name,
#             'quantity': item.quantity,
#             'price': item.product.price,
#             'total': item_total
#         })

#     return jsonify({'cart': cart_list, 'total': total}), HTTP_200_OK


# @cart.route('/add', methods=['POST'])
# @jwt_required()
# def add_to_cart():
#     print(f"DEBUG: Raw request.data: {request.data}")
#     print(f"DEBUG: Raw request.json: {request.json}")
#     data = request.get_json()
#     product_id = data.get('product_id')
#     quantity = data.get('quantity', 1)
#     user_id = get_jwt_identity()

#     product = Product.query.get(product_id)
#     if not product:
#         return jsonify({'message': 'Product not found'}), HTTP_404_NOT_FOUND

#     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
#     if not active_cart:
#         active_cart = Cart(user_id=user_id)
#         db.session.add(active_cart)
#         db.session.commit()

#     cart_item = CartItem.query.filter_by(cart_id=active_cart.cart_id, product_id=product_id).first()

#     if cart_item:
#         cart_item.quantity += quantity
#     else:
#         cart_item = CartItem(cart_id=active_cart.cart_id, product_id=product_id, quantity=quantity)
#         db.session.add(cart_item)

#     db.session.commit()
#     return jsonify({'message': 'Item added to cart'}), HTTP_201_CREATED


# @cart.route('/update/<int:cart_item_id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_quantity(cart_item_id):
#     data = request.get_json()
#     quantity = data.get('quantity')
#     user_id = get_jwt_identity()

#     cart_item = CartItem.query.join(Cart).filter(
#         Cart.user_id == user_id,
#         CartItem.cart_item_id == cart_item_id
#     ).first()

#     if not cart_item:
#         return jsonify({'message': 'Cart item not found'}), HTTP_404_NOT_FOUND

#     cart_item.quantity = quantity
#     db.session.commit()
#     return jsonify({'message': 'Quantity updated'}), HTTP_200_OK


# @cart.route('/remove/<int:cart_item_id>', methods=['DELETE'])
# @jwt_required()
# def remove_item(cart_item_id):
#     user_id = get_jwt_identity()
#     cart_item = CartItem.query.join(Cart).filter(
#         Cart.user_id == user_id,
#         CartItem.cart_item_id == cart_item_id
#     ).first()

#     if not cart_item:
#         return jsonify({'message': 'Cart item not found'}), HTTP_404_NOT_FOUND

#     db.session.delete(cart_item)
#     db.session.commit()
#     return jsonify({'message': 'Item removed'}), HTTP_200_OK


# # MAIN CHECKOUT ENDPOINT - For full cart checkout
# # @cart.route('/checkout', methods=['POST'])
# # @jwt_required()
# # def checkout_full_cart():
# #     """Checkout the entire cart with customer information"""
# #     user_id = get_jwt_identity()
# #     data = request.get_json()
    
# #     print(f"DEBUG: Received checkout data: {data}")
    
# #     # Extract customer info and cart data from frontend
# #     customer_info = data.get('customerInfo', {})
# #     cart_items = data.get('cart', [])
# #     frontend_total = data.get('total', 0)
    
# #     # Validate required customer information
# #     required_fields = ['name', 'email', 'phone']
# #     for field in required_fields:
# #         if not customer_info.get(field):
# #             return jsonify({
# #                 'success': False,
# #                 'error': f'Missing required field: {field}'
# #             }), HTTP_400_BAD_REQUEST
    
# #     # Get user's active cart from database
# #     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
    
# #     if not active_cart or not active_cart.items:
# #         return jsonify({
# #             'success': False,
# #             'error': 'Cart is empty'
# #         }), HTTP_400_BAD_REQUEST

# #     try:
# #         total = 0
        
# #         # Create new order with customer information
# #         new_order = Order(
# #             user_id=user_id, 
# #             status='pending', 
# #             total_amount=0,  # Will be updated after calculating items
# #             customer_name=customer_info.get('name'),
# #             customer_email=customer_info.get('email'),
# #             customer_phone=customer_info.get('phone'),
# #             delivery_address=customer_info.get('address', ''),
# #             city=customer_info.get('city', ''),
# #             payment_method=customer_info.get('paymentMethod', 'cod'),
# #             special_notes=customer_info.get('notes', '')
# #         )
        
# #         # Add mobile money details if payment method is momo
# #         if customer_info.get('paymentMethod') == 'momo':
# #             new_order.momo_number = customer_info.get('momoNumber', '')
# #             new_order.momo_network = customer_info.get('momoNetwork', '')
        
# #         db.session.add(new_order)
# #         db.session.flush()  # Get order_id

# #         # Create order items from cart
# #         for item in active_cart.items:
# #             price = item.product.price  # Get current product price
# #             item_total = item.quantity * price
# #             total += item_total

# #             order_item = OrderItem(
# #                 order_id=new_order.order_id,
# #                 product_id=item.product_id,
# #                 quantity=item.quantity,
# #                 price=price
# #             )
# #             db.session.add(order_item)

# #         # Update order total
# #         new_order.total_amount = total
        
# #         # Clear cart by deactivating it
# #         active_cart.is_active = False
        
# #         db.session.commit()

# #         print(f"✅ Order {new_order.order_id} created successfully for {customer_info.get('name')}")

# #         return jsonify({
# #             'success': True,
# #             'message': 'Order placed successfully',
# #             'order_id': new_order.order_id,
# #             'total': total
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Checkout error: {str(e)}")
# #         return jsonify({
# #             'success': False,
# #             'error': f'Failed to process order: {str(e)}'
# #         }), HTTP_500_INTERNAL_SERVER_ERROR


# # # INDIVIDUAL ITEM CHECKOUT - Renamed route to avoid conflict
# # @cart.route('/checkout/item/<int:cart_item_id>', methods=['POST'])
# # @jwt_required()
# # def checkout_single_item(cart_item_id):
# #     """Checkout a specific cart item"""
# #     user_id = get_jwt_identity()

# #     # Join CartItem with Cart to access user_id via the cart relationship
# #     cart_item = db.session.query(CartItem).join(Cart).filter(
# #         CartItem.cart_item_id == cart_item_id,
# #         Cart.user_id == user_id
# #     ).first()

# #     if not cart_item:
# #         return jsonify({'error': 'Cart item not found'}), HTTP_404_NOT_FOUND

# #     try:
# #         # Access price from the product relation
# #         product_price = cart_item.product.price
# #         total = product_price * cart_item.quantity

# #         # Create an Order with your current model structure
# #         order = Order(
# #             user_id=user_id, 
# #             status='pending', 
# #             total_amount=total
# #         )
# #         db.session.add(order)
# #         db.session.flush()  # To get order.order_id

# #         # Create OrderItem
# #         order_item = OrderItem(
# #             order_id=order.order_id,
# #             product_id=cart_item.product_id,
# #             quantity=cart_item.quantity,
# #             price=product_price
# #         )
# #         db.session.add(order_item)

# #         # Remove the item from the cart
# #         db.session.delete(cart_item)

# #         db.session.commit()
# #         return jsonify({
# #             'success': True,
# #             'message': 'Checkout successful',
# #             'order_id': order.order_id,
# #             'total': total
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         return jsonify({
# #             'success': False,
# #             'error': str(e)
# #         }), HTTP_500_INTERNAL_SERVER_ERROR
    



# # Fixed cart.py - Main checkout endpoint
# @cart.route('/checkout', methods=['POST'])
# @jwt_required()
# def checkout_full_cart():
#     """Checkout the entire cart with customer information"""
#     user_id = get_jwt_identity()
#     data = request.get_json()
    
#     print(f"DEBUG: Received checkout data: {data}")
    
#     # Extract customer info from frontend
#     customer_info = data.get('customerInfo', {})
    
#     # Validate required customer information
#     required_fields = ['name', 'email', 'phone']
#     for field in required_fields:
#         if not customer_info.get(field):
#             return jsonify({
#                 'success': False,
#                 'error': f'Missing required field: {field}'
#             }), HTTP_400_BAD_REQUEST
    
#     # Get user's active cart from database
#     active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
    
#     if not active_cart or not active_cart.items:
#         return jsonify({
#             'success': False,
#             'error': 'Cart is empty'
#         }), HTTP_400_BAD_REQUEST

#     try:
#         total = 0
        
#         # Create new order with basic required fields first
#         new_order = Order(
#             user_id=user_id, 
#             status='pending', 
#             total_amount=0  # Will be updated after calculating items
#         )
        
#         # Add customer information fields if they exist in your Order model
#         # Check if your Order model has these fields before setting them
#         try:
#             if hasattr(Order, 'customer_name'):
#                 new_order.customer_name = customer_info.get('name')
#             if hasattr(Order, 'customer_email'):
#                 new_order.customer_email = customer_info.get('email')
#             if hasattr(Order, 'customer_phone'):
#                 new_order.customer_phone = customer_info.get('phone')
#             if hasattr(Order, 'delivery_address'):
#                 new_order.delivery_address = customer_info.get('address', '')
#             if hasattr(Order, 'city'):
#                 new_order.city = customer_info.get('city', '')
#             if hasattr(Order, 'payment_method'):
#                 new_order.payment_method = customer_info.get('paymentMethod', 'cod')
#             if hasattr(Order, 'special_notes'):
#                 new_order.special_notes = customer_info.get('notes', '')
            
#             # Add mobile money details if payment method is momo
#             if customer_info.get('paymentMethod') == 'momo':
#                 if hasattr(Order, 'momo_number'):
#                     new_order.momo_number = customer_info.get('momoNumber', '')
#                 if hasattr(Order, 'momo_network'):
#                     new_order.momo_network = customer_info.get('momoNetwork', '')
#         except Exception as field_error:
#             print(f"Warning: Some order fields not available in model: {field_error}")
        
#         db.session.add(new_order)
#         db.session.flush()  # Get order_id

#         print(f"DEBUG: Created order with ID: {new_order.order_id}")

#         # Create order items from cart
#         for item in active_cart.items:
#             price = item.product.price  # Get current product price
#             item_total = item.quantity * price
#             total += item_total

#             order_item = OrderItem(
#                 order_id=new_order.order_id,
#                 product_id=item.product_id,
#                 quantity=item.quantity,
#                 price=price
#             )
#             db.session.add(order_item)
#             print(f"DEBUG: Added order item - Product: {item.product_id}, Qty: {item.quantity}, Price: {price}")

#         # Update order total
#         new_order.total_amount = total
        
#         # Clear cart by deactivating it
#         active_cart.is_active = False
        
#         db.session.commit()

#         print(f"✅ Order {new_order.order_id} created successfully for {customer_info.get('name')}")

#         return jsonify({
#             'success': True,
#             'message': 'Order placed successfully',
#             'order_id': new_order.order_id,
#             'total': float(total)  # Convert to float for JSON serialization
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         print(f"Checkout error: {str(e)}")
#         print(f"Error type: {type(e).__name__}")
#         import traceback
#         traceback.print_exc()
#         return jsonify({
#             'success': False,
#             'error': f'Failed to process order: {str(e)}'
#         }), HTTP_500_INTERNAL_SERVER_ERROR




# # In app/api/cart.py

# from flask import Blueprint, request, jsonify
# from app.extensions import db
# from app.models.cart import Cart, CartItem
# from app.models.product import Product
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
# )
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem
# import json # Import the json module
# # In app/api/cart.py

# # In app/controllers/cart/cart_controller.py

# # ... (all your existing imports) ...
# import json

# cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')

# # ... (all your other existing routes) ...

# @cart.route('/checkout', methods=['POST'])
# @jwt_required()
# def checkout_full_cart():
#     """Checkout the entire cart with customer and cart information from the request body."""
#     user_id = get_jwt_identity()

#     # --- Step 1: Parse data from the request, handling both JSON and FormData ---
#     customer_info = {}
#     cart_items = []
#     frontend_total = 0

#     if request.is_json:
#         # For JSON requests (fallback)
#         data = request.get_json()
#         if not data:
#             return jsonify({'success': False, 'error': 'No data received'}), HTTP_400_BAD_REQUEST
#         customer_info = data.get('customerInfo', {})
#         cart_items = data.get('cart', [])
#         frontend_total = data.get('total', 0)
#     else:
#         # For multipart/form-data requests (primary method)
#         if not request.form:
#             return jsonify({'success': False, 'error': 'No form data received'}), HTTP_400_BAD_REQUEST
        
#         try:
#             customer_info_str = request.form.get('customerInfo')
#             cart_str = request.form.get('cart')
#             frontend_total_str = request.form.get('total')
            
#             customer_info = json.loads(customer_info_str)
#             cart_items = json.loads(cart_str)
#             frontend_total = float(frontend_total_str)
            
#             payment_proof = request.files.get('paymentProof')
#             if payment_proof:
#                 print(f"DEBUG: Payment proof file received: {payment_proof.filename}")

#         except (json.JSONDecodeError, ValueError, TypeError) as e:
#             print(f"Error parsing data from form: {e}")
#             return jsonify({'success': False, 'error': 'Invalid data format from frontend'}), HTTP_400_BAD_REQUEST

#     print(f"DEBUG: Processing checkout data: {customer_info}")
    
#     # --- Step 2: Validate customer and cart data from the request body ---
#     required_customer_fields = ['name', 'email', 'phone']
#     for field in required_customer_fields:
#         if not customer_info.get(field):
#             return jsonify({'success': False, 'error': f'Missing required customer field: {field}'}), HTTP_400_BAD_REQUEST
    
#     if not cart_items:
#         return jsonify({'success': False, 'error': 'Cart is empty. No items provided in the request.'}), HTTP_400_BAD_REQUEST
    
#     # --- Step 3: Begin the database transaction to create the order ---
#     try:
#         total = 0
        
#         # ✅ CORRECTED LINE: Use 'product_id' instead of 'id'
#         product_ids_in_cart = [item['id'] for item in cart_items]
#         db_products = {p.product_id: p for p in Product.query.filter(Product.product_id.in_(product_ids_in_cart)).all()}
        
#         if len(db_products) != len(cart_items):
#             return jsonify({'success': False, 'error': 'One or more products in your cart were not found.'}), HTTP_404_NOT_FOUND
            
#         # Create new order using the data from the request
#         new_order = Order(
#             user_id=user_id,
#             status='pending',
#             total_amount=0,
#             customer_name=customer_info.get('name'),
#             customer_email=customer_info.get('email'),
#             customer_phone=customer_info.get('phone'),
#             delivery_address=customer_info.get('address', ''),
#             city=customer_info.get('city', ''),
#             payment_method=customer_info.get('paymentMethod', 'cod'),
#             momo_number=customer_info.get('momoNumber', ''),
#             momo_network=customer_info.get('momoNetwork', ''),
#             special_notes=customer_info.get('notes', '')
#         )
        
#         db.session.add(new_order)
#         db.session.flush()

#         # Create order items and calculate total based on request data
#         for item in cart_items:
#             # ✅ CORRECTED LINE: Access the product by its product_id
#             product = db_products.get(item['id'])
#             if not product:
#                  # This check is redundant due to the check above but is good practice
#                  continue
                 
#             price = product.price
#             item_total = item['quantity'] * price
#             total += item_total

#             order_item = OrderItem(
#                 order_id=new_order.order_id,
#                 product_id=product.product_id, # ✅ Use product.product_id here
#                 quantity=item['quantity'],
#                 price=price
#             )
#             db.session.add(order_item)
            
#         new_order.total_amount = total
        
#         # --- Step 4: Clear the user's database cart ---
#         active_cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
#         if active_cart:
#             active_cart.is_active = False
            
#         db.session.commit()

#         return jsonify({
#             'success': True,
#             'message': 'Order placed successfully',
#             'order_id': new_order.order_id,
#             'total': float(total)
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         print(f"Checkout error: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         return jsonify({
#             'success': False,
#             'error': f'Failed to process order: {str(e)}'
#         }), HTTP_500_INTERNAL_SERVER_ERROR



#GUEST CHECKOUT - For testing purposes

# app/controllers/cart/cart_controller.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
)

cart = Blueprint('cart', __name__, url_prefix='/api/v1/cart')

# --- SERIALIZATION HELPER FUNCTIONS ---
def serialize_cart_item(item):
    """Serializes a CartItem object."""
    return {
        'cart_item_id': item.cart_item_id,
        'product_id': item.product_id,
        'quantity': item.quantity,
        'product_name': item.product.name,
        'product_price': str(item.product.price),
        'total_price': str(item.product.price * item.quantity)
    }

def serialize_cart(cart_obj):
    """Serializes a Cart object and its items."""
    return {
        'cart_id': cart_obj.cart_id,
        'user_id': cart_obj.user_id,
        'is_active': cart_obj.is_active,
        'items': [serialize_cart_item(item) for item in cart_obj.items],
        'total_items': sum(item.quantity for item in cart_obj.items)
    }

# --- CORE LOGIC HELPER FUNCTION ---
def _process_checkout(items_data, customer_info, user_id=None):
    """
    Unified function to handle checkout logic for both registered and guest users.
    This prevents code duplication.
    """
    try:
        # Validate data
        if not items_data:
            return {'success': False, 'error': 'Cart is empty. No items provided.'}, HTTP_400_BAD_REQUEST

        product_ids_in_cart = [item['product_id'] for item in items_data]
        # Fixed: Use product_id instead of id, and fixed syntax error
        db_products = {p.product_id: p for p in Product.query.filter(Product.product_id.in_(product_ids_in_cart)).all()}
        
        if len(db_products) != len(items_data):
            return {'success': False, 'error': 'One or more products in your cart were not found.'}, HTTP_404_NOT_FOUND
        
        # Calculate total and check stock
        total_price = 0
        order_items_list = []
        for item in items_data:
            product = db_products.get(item['product_id'])
            quantity = item['quantity']
            
            if product.stock < quantity:
                return {'success': False, 'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}, HTTP_400_BAD_REQUEST

            total_price += product.price * quantity
            order_items_list.append({
                'product_id': product.product_id,  # Fixed: Use product_id instead of id
                'quantity': quantity,
                'price': product.price
            })

        # Create the new order using the correct field names from your Order model
        # Combine first_name and last_name into customer_name
        customer_name = f"{customer_info.get('first_name', '').strip()} {customer_info.get('last_name', '').strip()}".strip()
        if not customer_name:  # Fallback if no separate first/last names
            customer_name = customer_info.get('name', 'Guest Customer')
        
        new_order = Order(
            user_id=user_id,
            status='pending',  # Your model uses lowercase 'pending'
            total_amount=total_price,  # Your model uses 'total_amount' not 'total_price'
            customer_name=customer_name,
            customer_email=customer_info.get('email', ''),
            customer_phone=customer_info.get('contact', ''),
            delivery_address=customer_info.get('shipping_address', ''),
            city=customer_info.get('city', ''),
            payment_method=customer_info.get('payment_method', 'cod'),  # Default to 'cod' as per your model
            momo_number=customer_info.get('momo_number', ''),
            momo_network=customer_info.get('momo_network', ''),
            special_notes=customer_info.get('special_notes', '')
        )

        db.session.add(new_order)
        db.session.flush()  # Get the order ID

        # Create order items
        for item_data in order_items_list:
            order_item = OrderItem(
                order_id=new_order.order_id,  # Use order_id instead of id
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_data['price']  # Use 'price' instead of 'price_at_time_of_purchase'
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return {
            'success': True,
            'message': 'Order placed successfully',
            'order_id': new_order.order_id,  # Use order_id instead of id
            'total': float(total_price)
        }, HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error processing checkout: {e}", exc_info=True)
        return {'success': False, 'error': 'An internal server error occurred.'}, HTTP_500_INTERNAL_SERVER_ERROR

# --- CART ROUTES FOR REGISTERED USERS (AUTHENTICATED) ---

@cart.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Adds a product to the authenticated user's cart."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        current_app.logger.info(f"🛒 Add to cart request - User: {user_id}, Product: {product_id}, Quantity: {quantity}")

        if not product_id or not quantity or quantity <= 0:
            return jsonify({'error': 'Invalid product ID or quantity'}), HTTP_400_BAD_REQUEST
        
        # Fixed: Use get() method with product_id instead of id
        product = Product.query.filter_by(product_id=product_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), HTTP_404_NOT_FOUND
        if product.stock < quantity:
            return jsonify({'error': f'Insufficient stock for "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

        # Get or create cart
        cart_obj = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        if not cart_obj:
            current_app.logger.info(f"📦 Creating new cart for user {user_id}")
            cart_obj = Cart(user_id=user_id, is_active=True)
            db.session.add(cart_obj)
            db.session.commit()  # Commit to get the ID
            db.session.refresh(cart_obj)  # Refresh to ensure we have the ID
            current_app.logger.info(f"✅ New cart created with ID: {cart_obj.cart_id}")
        else:
            current_app.logger.info(f"📦 Using existing cart with ID: {cart_obj.cart_id}")

        # Check if item already exists in cart - using cart_id instead of id
        cart_item = CartItem.query.filter_by(cart_id=cart_obj.cart_id, product_id=product_id).first()
        if cart_item:
            current_app.logger.info(f"🔄 Updating existing cart item - Current quantity: {cart_item.quantity}")
            # Update existing item
            if product.stock < (cart_item.quantity + quantity):
                return jsonify({'error': f'Insufficient stock for "{product.name}". Only {product.stock} available, you already have {cart_item.quantity} in cart.'}), HTTP_400_BAD_REQUEST
            cart_item.quantity += quantity
            current_app.logger.info(f"🔄 Updated quantity to: {cart_item.quantity}")
        else:
            current_app.logger.info(f"➕ Creating new cart item")
            # Create new cart item - using cart_id instead of id
            cart_item = CartItem(cart_id=cart_obj.cart_id, product_id=product_id, quantity=quantity)
            db.session.add(cart_item)
            current_app.logger.info(f"➕ New cart item created")

        db.session.commit()
        current_app.logger.info(f"💾 Changes committed to database")
        
        # Verify the item was actually saved
        verification_item = CartItem.query.filter_by(cart_id=cart_obj.cart_id, product_id=product_id).first()
        if verification_item:
            current_app.logger.info(f"✅ Verification: Item exists with quantity {verification_item.quantity}")
        else:
            current_app.logger.error(f"❌ Verification failed: Item not found in database!")
        
        return jsonify({'message': 'Item added to cart successfully'}), HTTP_201_CREATED
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding to cart: {e}", exc_info=True)
        return jsonify({'error': 'Failed to add item to cart'}), HTTP_500_INTERNAL_SERVER_ERROR

@cart.route('/', methods=['GET'])
@jwt_required()
def get_user_cart():
    """Retrieves the authenticated user's active cart."""
    try:
        user_id = get_jwt_identity()
        current_app.logger.info(f"🔍 Getting cart for user: {user_id}")
        
        cart_obj = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        
        if not cart_obj:
            current_app.logger.info(f"📭 No active cart found for user {user_id}")
            return jsonify({'message': 'Cart is empty', 'cart': None}), HTTP_200_OK
        
        current_app.logger.info(f"📦 Found cart with ID: {cart_obj.cart_id}")
        current_app.logger.info(f"📝 Cart has {len(cart_obj.items)} items")
        
        for item in cart_obj.items:
            current_app.logger.info(f"  - Item: Product ID {item.product_id}, Quantity: {item.quantity}")
        
        if not cart_obj.items:
            current_app.logger.info(f"📭 Cart exists but has no items")
            return jsonify({'message': 'Cart is empty', 'cart': None}), HTTP_200_OK
        
        serialized_cart = serialize_cart(cart_obj)
        current_app.logger.info(f"📤 Returning serialized cart: {serialized_cart}")
        
        return jsonify(serialized_cart), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error getting cart: {e}", exc_info=True)
        return jsonify({'error': 'Failed to retrieve cart'}), HTTP_500_INTERNAL_SERVER_ERROR

@cart.route('/update', methods=['PUT'])
@jwt_required()
def update_cart_item():
    """Updates the quantity of a specific item in the authenticated user's cart."""
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not product_id or quantity is None:
        return jsonify({'error': 'Product ID and quantity are required'}), HTTP_400_BAD_REQUEST
    
    cart_obj = Cart.query.filter_by(user_id=user_id, is_active=True).first()
    if not cart_obj:
        return jsonify({'error': 'Cart not found'}), HTTP_404_NOT_FOUND

    cart_item = CartItem.query.filter_by(cart_id=cart_obj.cart_id, product_id=product_id).first()
    if not cart_item:
        return jsonify({'error': 'Item not found in cart'}), HTTP_404_NOT_FOUND

    # Fixed: Use filter_by with product_id instead of get() with id
    product = Product.query.filter_by(product_id=product_id).first()
    if product.stock < quantity:
         return jsonify({'error': f'Insufficient stock for "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST
    
    if quantity <= 0:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = quantity
    
    db.session.commit()
    return jsonify({'message': 'Cart updated successfully'}), HTTP_200_OK

@cart.route('/remove', methods=['DELETE'])
@jwt_required()
def remove_from_cart():
    """Removes a product from the authenticated user's cart."""
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), HTTP_400_BAD_REQUEST

    cart_obj = Cart.query.filter_by(user_id=user_id, is_active=True).first()
    if not cart_obj:
        return jsonify({'error': 'Cart not found'}), HTTP_404_NOT_FOUND

    cart_item = CartItem.query.filter_by(cart_id=cart_obj.cart_id, product_id=product_id).first()
    if not cart_item:
        return jsonify({'error': 'Item not found in cart'}), HTTP_404_NOT_FOUND

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart successfully'}), HTTP_200_OK

@cart.route('/checkout', methods=['POST'])
@jwt_required()
def checkout_registered_user_cart():
    """
    Checks out the authenticated user's active cart.
    This route fetches items from the database cart, not the request body.
    """
    try:
        user_id = get_jwt_identity()
        
        # Fetch the user's active cart from the database
        cart_obj = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        if not cart_obj or not cart_obj.items:
            return jsonify({'success': False, 'error': 'Cart not found or is empty.'}), HTTP_404_NOT_FOUND
        
        # Prepare items for checkout
        items_for_checkout = []
        for item in cart_obj.items:
            items_for_checkout.append({
                'product_id': item.product_id,
                'quantity': item.quantity
            })

        # The request body should contain customer info (e.g., shipping)
        customer_data = request.get_json()
        if not customer_data:
            return jsonify({'success': False, 'error': 'Customer information is required.'}), HTTP_400_BAD_REQUEST

        # Log received data for debugging
        current_app.logger.info(f"Received checkout data: {customer_data}")

        # Validate required fields
        required_fields = ['first_name', 'email', 'contact']
        missing_fields = [field for field in required_fields if not customer_data.get(field)]
        if missing_fields:
            return jsonify({
                'success': False, 
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), HTTP_400_BAD_REQUEST

        # Process customer info - ensure all expected fields are present
        customer_info = {
            'first_name': customer_data.get('first_name', ''),
            'last_name': customer_data.get('last_name', ''),
            'email': customer_data.get('email', ''),
            'contact': customer_data.get('contact', ''),
            'shipping_address': customer_data.get('shipping_address', ''),
            'payment_method': customer_data.get('payment_method', 'cash'),
            'momo_number': customer_data.get('momo_number', ''),
            'momo_network': customer_data.get('momo_network', '')
        }

        # Call the unified helper function
        response, status = _process_checkout(items_for_checkout, customer_info, user_id)

        # If the order was successful, deactivate the user's cart
        if status == HTTP_201_CREATED:
            cart_obj.is_active = False
            db.session.commit()
        
        return jsonify(response), status
        
    except Exception as e:
        current_app.logger.error(f"Error in authenticated checkout: {e}", exc_info=True)
        return jsonify({'success': False, 'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# --- GUEST USER CHECKOUT ROUTE (UNAUTHENTICATED) ---
@cart.route('/guest/checkout', methods=['POST'])
def checkout_guest_cart():
    """
    Checks out a guest user's cart.
    This route does NOT require authentication and processes items from the request body.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data received'}), HTTP_400_BAD_REQUEST

        # Log received data for debugging
        current_app.logger.info(f"Guest checkout data: {data}")

        customer_info = data.get('customerInfo', {})
        cart_items = data.get('cart', [])

        # Map the frontend's 'name' field and other fields to match the Order model
        customer_name = customer_info.get('name', 'Guest Customer')
        
        processed_customer_info = {
            'name': customer_name,  # Keep original for potential splitting
            'first_name': customer_name.split(' ')[0] if customer_name else 'Guest',
            'last_name': ' '.join(customer_name.split(' ')[1:]) if customer_name and len(customer_name.split(' ')) > 1 else '',
            'email': customer_info.get('email'),
            'contact': customer_info.get('phone'),  # Map 'phone' to 'contact' for consistency
            'shipping_address': customer_info.get('address'),
            'city': customer_info.get('city'),
            'payment_method': customer_info.get('paymentMethod', 'cod'),  # Default to 'cod'
            'momo_number': customer_info.get('momoNumber'),
            'momo_network': customer_info.get('momoNetwork'),
            'special_notes': customer_info.get('specialNotes'),
        }

        # Validate customer and cart data based on Order model requirements
        required_customer_fields = ['name', 'email', 'contact']  # Match Order model required fields
        missing_fields = []
        
        # Check for name (maps to customer_name)
        if not processed_customer_info.get('name'):
            missing_fields.append('name')
        # Check for email (maps to customer_email) 
        if not processed_customer_info.get('email'):
            missing_fields.append('email')
        # Check for contact (maps to customer_phone)
        if not processed_customer_info.get('contact'):
            missing_fields.append('phone')
            
        if missing_fields:
            return jsonify({
                'success': False, 
                'error': f'Missing customer information: {", ".join(missing_fields)}'
            }), HTTP_400_BAD_REQUEST

        if not cart_items:
            return jsonify({'success': False, 'error': 'Cart is empty'}), HTTP_400_BAD_REQUEST

        # Call the unified helper function with the processed data
        response, status = _process_checkout(cart_items, processed_customer_info, user_id=None)

        return jsonify(response), status
        
    except Exception as e:
        current_app.logger.error(f"Error in guest checkout: {e}", exc_info=True)
        return jsonify({'success': False, 'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# --- DEBUG ROUTE (Remove after testing) ---
@cart.route('/test', methods=['GET'])
def test_cart_routes():
    """Debug route to test if cart blueprint is registered"""
    return jsonify({
        'message': 'Cart routes are working!', 
        'status': 'success',
        'available_routes': [
            'GET /api/v1/cart/ - Get user cart',
            'POST /api/v1/cart/add - Add to cart',
            'PUT /api/v1/cart/update - Update cart item',
            'DELETE /api/v1/cart/remove - Remove from cart',
            'POST /api/v1/cart/checkout - Authenticated checkout',
            'POST /api/v1/cart/guest/checkout - Guest checkout'
        ]
    }), HTTP_200_OK