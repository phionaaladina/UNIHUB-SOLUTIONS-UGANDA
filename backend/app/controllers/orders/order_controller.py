# from flask import Blueprint, request, jsonify
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem
# from app.models.product import Product # Import Product model
# from app.models.user import User # Import User model
# from app.extensions import db
# from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR,
#     HTTP_403_FORBIDDEN
# )
# from app.models.sale import Sale # Import the Sale model


# # Define the order blueprint
# order = Blueprint('order', __name__, url_prefix='/api/v1/orders')

# def is_admin_or_superadmin():
#     """
#     Helper function to check if the current user has admin or super_admin role.
#     """
#     claims = get_jwt()
#     # Ensure 'user_type' is used as defined in auth.py, and 'super_admin' spelling is consistent
#     return claims.get('user_type') in ['admin', 'super_admin']

# # --- HELPER FUNCTION FOR ORDER ITEM SERIALIZATION ---
# def serialize_order_item(order_item):
#     """
#     Serializes an OrderItem object, including details from the associated Product.
#     """
#     product = Product.query.get(order_item.product_id)
#     return {
#         'product_id': order_item.product_id,
#         'product_name': product.name if product else 'Unknown Product',
#         'product_image_url': product.image_url if product else None, # Assuming product has an image_url attribute
#         'quantity': order_item.quantity,
#         'price_at_purchase': str(order_item.price) # Convert Decimal to string for JSON compatibility
#     }

# # --- HELPER FUNCTION FOR ORDER SERIALIZATION ---
# def serialize_order(o, include_user_details=False):
#     """
#     Serializes an Order object, optionally including associated User details.
#     """
#     order_data = {
#         'order_id': o.order_id,
#         'user_id': o.user_id,
#         'status': o.status,
#         'total_amount': str(o.total_amount), # Convert Decimal to string for JSON compatibility
#         'created_at': o.created_at.isoformat() if o.created_at else None,
#         'updated_at': o.updated_at.isoformat() if o.updated_at else None,
#         'items': [serialize_order_item(item) for item in o.items]
#     }
#     if include_user_details:
#         user = User.query.get(o.user_id)
#         order_data['user_details'] = {
#             'id': user.id,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'email': user.email,
#             'contact': user.contact,
#             'user_type': user.user_type
#         } if user else None # Handle case where user might not be found (e.g. deleted)
#     return order_data


# # --- USER ROUTES (unchanged, but included for completeness) ---

# @order.route('/', methods=['POST'])
# @jwt_required()
# def create_order():
#     """
#     Creates a new order for the logged-in user.
#     Requires a JSON body with a 'items' list, where each item has 'product_id' and 'quantity'.
#     Calculates total_amount based on current product prices.
#     """
#     user_id = get_jwt_identity()
#     data = request.get_json()

#     items_data = data.get('items')
#     if not items_data or not isinstance(items_data, list):
#         return jsonify({'error': 'Items must be a list'}), HTTP_400_BAD_REQUEST

#     # Basic validation for empty items list
#     if not items_data:
#         return jsonify({'error': 'Order must contain at least one item'}), HTTP_400_BAD_REQUEST

#     try:
#         total_amount = 0
#         order_obj = Order(user_id=user_id, status='pending') # Renamed variable to avoid conflict
#         db.session.add(order_obj)
#         db.session.flush()  # To get order.order_id for order items before committing

#         for item_data in items_data:
#             product_id = item_data.get('product_id')
#             quantity = item_data.get('quantity', 1)

#             if not product_id:
#                 db.session.rollback() # Rollback if validation fails mid-loop
#                 return jsonify({'error': 'Product ID is required for each item'}), HTTP_400_BAD_REQUEST
#             if not isinstance(quantity, int) or quantity <= 0:
#                 db.session.rollback() # Rollback if validation fails mid-loop
#                 return jsonify({'error': 'Quantity must be a positive integer for each item'}), HTTP_400_BAD_REQUEST

#             product = Product.query.get(product_id)
#             if not product:
#                 db.session.rollback() # Rollback if product not found
#                 return jsonify({'error': f'Product with ID {product_id} not found'}), HTTP_404_NOT_FOUND

#             # Stock check at time of order creation (optional but recommended for user experience)
#             if product.stock < quantity:
#                 db.session.rollback()
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST


#             # Store the product's current price at the time of purchase in the order item
#             order_item = OrderItem(
#                 order_id=order_obj.order_id, # Use order_obj here
#                 product_id=product_id,
#                 quantity=quantity,
#                 price=product.price # Use the product's current price
#             )
#             total_amount += order_item.price * quantity
#             db.session.add(order_item)

#         order_obj.total_amount = total_amount # Use order_obj here
#         db.session.commit()
#         return jsonify({'message': 'Order created successfully', 'order': serialize_order(order_obj)}), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         print(f"Error creating order: {e}") # Log the error for debugging
#         return jsonify({'error': 'Internal server error creating order', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# @order.route('/', methods=['GET'])
# @jwt_required()
# def get_orders():
#     """
#     Retrieves all orders for the currently logged-in user.
#     """
#     user_id = get_jwt_identity()
#     orders = Order.query.filter_by(user_id=user_id).all()
#     return jsonify([serialize_order(o) for o in orders]), HTTP_200_OK


# @order.route('/<int:order_id>', methods=['GET'])
# @jwt_required()
# def get_order(order_id):
#     """
#     Retrieves a specific order by ID for the currently logged-in user.
#     Ensures the user can only access their own orders.
#     """
#     user_id = get_jwt_identity()
#     # Renamed variable to avoid conflict, although not strictly necessary here,
#     # it's good for consistency if `order` is a common variable name elsewhere.
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to view'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj)), HTTP_200_OK


# @order.route('/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def update_order_status(order_id):
#     """
#     Allows a user to update the status of their own order (e.g., 'cancelled').
#     Restricts status transitions (e.g., only pending orders can be cancelled).
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first() # Renamed variable
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to update'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     status = data.get('status')
#     if not status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     # Define allowed status transitions for a regular user
#     allowed_transitions = {
#         'pending': ['cancelled'],
#         # Users typically can't change to processing/shipped/delivered.
#         # Admins will handle those.
#     }

#     if status not in allowed_transitions.get(order_obj.status, []): # Use order_obj
#         return jsonify({'error': f'Invalid status transition from "{order_obj.status}" to "{status}"'}), HTTP_400_BAD_REQUEST

#     order_obj.status = status # Use order_obj
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {status}'}), HTTP_200_OK


# @order.route('/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def delete_order(order_id):
#     """
#     Allows a user to delete their own order.
#     Consider adding restrictions: e.g., only pending or cancelled orders can be deleted by user.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first() # Renamed variable
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to delete'}), HTTP_404_NOT_FOUND

#     # Example restriction: Only allow deletion if order is pending or cancelled
#     if order_obj.status not in ['pending', 'cancelled']: # Use order_obj
#         return jsonify({'error': 'Only pending or cancelled orders can be deleted by user'}), HTTP_400_BAD_REQUEST

#     # Delete associated order items first (or ensure SQLAlchemy cascade handles this)
#     for item in order_obj.items: # Use order_obj
#         db.session.delete(item)

#     db.session.delete(order_obj) # Use order_obj
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK


# # --- ADMIN/SUPERADMIN ROUTES ---

# @order.route('/admin', methods=['GET'])
# @jwt_required()
# def admin_get_all_orders():
#     """
#     Admin/Superadmin only: Retrieves all orders in the system with pagination and optional search.
#     Includes full user details for each order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)
#     search_query = request.args.get('search', '', type=str) # Renamed to avoid conflict

#     query = Order.query

#     if search_query:
#         # Search by order ID or by user email/name (requires joining User table)
#         try:
#             search_id = int(search_query)
#             query = query.filter(Order.order_id == search_id)
#         except ValueError:
#             # If search is not an int, try searching by user email or name
#             # This requires a join and careful handling to avoid duplicates if user has many orders
#             query = query.join(User).filter(
#                 (User.email.ilike(f'%{search_query}%')) |
#                 (User.first_name.ilike(f'%{search_query}%')) |
#                 (User.last_name.ilike(f'%{search_query}%'))
#             )

#     paginated_orders = query.paginate(page=page, per_page=per_page, error_out=False)

#     return jsonify({
#         'orders': [serialize_order(o, include_user_details=True) for o in paginated_orders.items],
#         'total_orders': paginated_orders.total,
#         'pages': paginated_orders.pages,
#         'current_page': paginated_orders.page,
#         'per_page': paginated_orders.per_page
#     }), HTTP_200_OK


# @order.route('/admin/<int:order_id>', methods=['GET'])
# @jwt_required()
# def admin_get_order(order_id):
#     """
#     Admin/Superadmin only: Retrieves a specific order by ID.
#     Includes full user details for the order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     # Renamed variable to avoid conflict
#     order_obj = Order.query.filter_by(order_id=order_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj, include_user_details=True)), HTTP_200_OK


# @order.route('/admin/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def admin_update_order_status(order_id):
#     """
#     Admin/Superadmin only: Updates the status of any order.
#     If status changes to 'delivered', a Sale record is created AND stock is reduced.
#     """
#     if not is_admin_or_superadmin():
#         print(f"DEBUG: User not authorized to update order status. Order ID: {order_id}")
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.filter_by(order_id=order_id).first()
#     if not order_obj:
#         print(f"DEBUG: Order ID {order_id} not found.")
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     new_status = data.get('status')
#     if not new_status:
#         print(f"DEBUG: New status not provided for Order ID: {order_id}")
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
#     if new_status not in allowed_statuses:
#         print(f"DEBUG: Invalid new status '{new_status}' for Order ID: {order_id}. Allowed: {allowed_statuses}")
#         return jsonify({'error': f'Invalid status. Allowed: {", ".join(allowed_statuses)}'}), HTTP_400_BAD_REQUEST

#     old_status = order_obj.status
#     print(f"DEBUG: Order ID {order_id} - Old Status: '{old_status}', New Status: '{new_status}'")

#     # --- STOCK REDUCTION & SALE CREATION LOGIC ---
#     # Trigger if status changes TO 'delivered' AND it was NOT already 'delivered'
#     if new_status == 'delivered' and old_status != 'delivered':
#         print(f"DEBUG: Order ID {order_id} - Status transition detected: '{old_status}' -> '{new_status}'. Initiating stock reduction and sale creation.")
#         try:
#             # 1. Reduce Product Stock
#             if not order_obj.items: # Check if the order has any items
#                 print(f"DEBUG: Order ID {order_id} has no items. No stock reduction needed.")
#                 # This might indicate an issue if orders are expected to always have items.
#             else:
#                 for item in order_obj.items:
#                     product_id = item.product_id
#                     quantity_ordered = item.quantity
#                     # CORRECTED LINE HERE: Using item.order_item_id as confirmed by your OrderItem blueprint
#                     print(f"DEBUG: Processing Order Item (ID: {item.order_item_id}) - Product ID: {product_id}, Quantity Ordered: {quantity_ordered}")

#                     # Fetch product using `with_for_update()` for optimistic locking (ensure this is compatible with your DB)
#                     # For most basic setups, `Product.query.get(product_id)` is fine.
#                     # Assuming product_id in OrderItem maps to 'product_id' in Product model
#                     product = Product.query.filter_by(product_id=product_id).with_for_update().first()
#                     # If Product model uses 'id' as PK, use: Product.query.get(product_id)

#                     if not product:
#                         print(f"ERROR: Product ID {product_id} not found for order item {item.order_item_id} in order {order_id}. Rolling back.")
#                         db.session.rollback()
#                         return jsonify({'error': f'Internal error: Product {product_id} not found for order item.'}), HTTP_500_INTERNAL_SERVER_ERROR

#                     print(f"DEBUG: Product '{product.name}' (ID: {product.product_id}) - Current Stock: {product.stock}")

#                     if product.stock >= quantity_ordered:
#                         product.stock -= quantity_ordered
#                         print(f"DEBUG: Reduced stock for Product '{product.name}' by {quantity_ordered}. New Stock: {product.stock}")
#                     else:
#                         print(f"ERROR: Insufficient stock for Product '{product.name}' (ID: {product.product_id}). Ordered: {quantity_ordered}, Available: {product.stock}. Rolling back.")
#                         db.session.rollback()
#                         return jsonify({
#                             'error': f'Insufficient stock for product "{product.name}". Ordered: {quantity_ordered}, Available: {product.stock}. Order status not updated.'
#                         }), HTTP_400_BAD_REQUEST

#             # 2. Create Sale Record (only if stock reduction was successful for all items)
#             existing_sale = Sale.query.filter_by(order_id=order_obj.order_id).first()
#             if existing_sale:
#                 print(f"DEBUG: Sale record already exists for order ID {order_obj.order_id}. Not creating a new one.")
#             else:
#                 sale = Sale(
#                     order_id=order_obj.order_id,
#                     amount=order_obj.total_amount,
#                     sale_date=datetime.utcnow()
#                 )
#                 db.session.add(sale)
#                 print(f"DEBUG: Sale record added to session for Order ID: {order_obj.order_id}")

#         except Exception as e:
#             db.session.rollback()
#             print(f"CRITICAL ERROR: Exception during stock reduction or sale creation for order {order_obj.order_id}: {e}")
#             return jsonify({'error': 'Failed to process stock and sale record during status update', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
#     else:
#         print(f"DEBUG: Order ID {order_id} - No stock/sale action taken. New status is '{new_status}', Old status was '{old_status}'. Condition (new_status=='delivered' and old_status!='delivered') not met.")

#     order_obj.status = new_status # Update the order status
#     db.session.commit() # Commit all changes (status, stock, sale record)
#     print(f"DEBUG: Order ID {order_id} - All changes committed. Final status: '{order_obj.status}'")
#     return jsonify({'message': f'Order status updated to {new_status}'}), HTTP_200_OK


# @order.route('/admin/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def admin_delete_order(order_id):
#     """
#     Admin/Superadmin only: Deletes an order and its associated items.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.filter_by(order_id=order_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted and associated items removed'}), HTTP_200_OK





# #ADDING GUEST CHECKOUT FUNCTIONALITY
# # app/controllers/order_controller.py
# from flask import Blueprint, request, jsonify
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem
# from app.models.product import Product
# from app.models.user import User
# from app.extensions import db
# from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR,
#     HTTP_403_FORBIDDEN
# )
# from app.models.sale import Sale

# # Define the order blueprint
# order = Blueprint('orders', __name__, url_prefix='/api/v1/orders')

# # --- AUTH HELPER FUNCTIONS ---
# def is_admin_or_superadmin():
#     """
#     Helper function to check if the current user has an admin or super_admin role.
#     """
#     claims = get_jwt()
#     return claims.get('user_type') in ['admin', 'super_admin']

# # --- SERIALIZATION HELPER FUNCTIONS ---
# def serialize_order_item(order_item):
#     """
#     Serializes an OrderItem object, including details from the associated Product.
#     """
#     product = Product.query.get(order_item.product_id)
#     return {
#         'product_id': order_item.product_id,
#         'product_name': product.name if product else 'Unknown Product',
#         'product_image_url': product.image_url if product else None,
#         'quantity': order_item.quantity,
#         'price_at_purchase': str(order_item.price_at_time_of_purchase)
#     }

# def serialize_order(o, include_user_details=False):
#     """
#     Serializes an Order object, optionally including associated User details for registered users.
#     Handles both registered and guest orders.
#     """
#     order_data = {
#         'order_id': o.id,
#         'user_id': o.user_id,
#         'status': o.status,
#         'total_amount': str(o.total_price),
#         'is_guest_order': o.is_guest_order,
#         'created_at': o.created_at.isoformat() if o.created_at else None,
#         'updated_at': o.updated_at.isoformat() if o.updated_at else None,
#         'items': [serialize_order_item(item) for item in o.order_items]
#     }
    
#     if o.is_guest_order:
#         order_data['guest_details'] = {
#             'first_name': o.first_name,
#             'last_name': o.last_name,
#             'email': o.email,
#             'contact': o.contact
#         }
#     elif include_user_details and o.user_id:
#         user = User.query.get(o.user_id)
#         order_data['user_details'] = {
#             'id': user.id,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'email': user.email,
#             'contact': user.contact,
#             'user_type': user.user_type
#         } if user else None
        
#     return order_data

# # --- GUEST ORDER ROUTE ---
# @order.route('/guest', methods=['POST'])
# def create_guest_order():
#     """
#     Handles guest checkout by creating an order without a registered user.
#     """
#     data = request.get_json()

#     # 1. Accept and Validate Data
#     required_fields = ['first_name', 'last_name', 'email', 'contact', 'shipping_address', 'items']
#     if not all(field in data for field in required_fields):
#         return jsonify({'error': 'Missing required fields'}), HTTP_400_BAD_REQUEST

#     if not isinstance(data['items'], list) or not data['items']:
#         return jsonify({'error': 'Items list is invalid or empty'}), HTTP_400_BAD_REQUEST

#     try:
#         total_price = 0
#         order_items_list = []
#         for item in data['items']:
#             product = Product.query.get(item.get('product_id'))
#             quantity = item.get('quantity')
            
#             if not product or not isinstance(quantity, int) or quantity <= 0:
#                 return jsonify({'error': f'Invalid product_id or quantity for product {item.get("product_id")}'}), HTTP_400_BAD_REQUEST
            
#             if product.stock < quantity:
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             total_price += product.price * quantity
#             order_items_list.append({
#                 'product_id': product.id,
#                 'quantity': quantity,
#                 'price': product.price
#             })

#         # 2. Create New Order Record
#         new_order = Order(
#             first_name=data['first_name'],
#             last_name=data['last_name'],
#             email=data['email'],
#             contact=data['contact'],
#             shipping_address=data['shipping_address'],
#             total_price=total_price,
#             status='Pending',
#             is_guest_order=True
#         )

#         db.session.add(new_order)
#         db.session.flush()
        
#         # 3. Link Ordered Products (OrderItems)
#         for item_data in order_items_list:
#             order_item = OrderItem(
#                 order_id=new_order.id,
#                 product_id=item_data['product_id'],
#                 quantity=item_data['quantity'],
#                 price_at_time_of_purchase=item_data['price']
#             )
#             db.session.add(order_item)
        
#         db.session.commit()

#         # 4. Return Response
#         return jsonify({
#             'message': 'Guest order placed successfully',
#             'order_id': new_order.id,
#             'total_price': new_order.total_price
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         print(f"Error creating guest order: {e}")
#         return jsonify({'error': 'An internal server error occurred.', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- USER ROUTES (for authenticated users) ---

# @order.route('/', methods=['POST'])
# @jwt_required()
# def create_order():
#     """
#     Creates a new order for the logged-in user.
#     """
#     user_id = get_jwt_identity()
#     data = request.get_json()

#     items_data = data.get('items')
#     if not items_data or not isinstance(items_data, list):
#         return jsonify({'error': 'Items must be a list'}), HTTP_400_BAD_REQUEST

#     if not items_data:
#         return jsonify({'error': 'Order must contain at least one item'}), HTTP_400_BAD_REQUEST

#     try:
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({'error': 'Authenticated user not found'}), HTTP_404_NOT_FOUND

#         total_price = 0
#         order_obj = Order(
#             user_id=user_id,
#             status='pending',
#             is_guest_order=False,
#             first_name=user.first_name,
#             last_name=user.last_name,
#             email=user.email,
#             contact=user.contact,
#             shipping_address=data.get('shipping_address') # Assumes shipping_address is provided in the request body for authenticated users as well
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         for item_data in items_data:
#             product_id = item_data.get('product_id')
#             quantity = item_data.get('quantity', 1)

#             if not product_id or not isinstance(quantity, int) or quantity <= 0:
#                 db.session.rollback()
#                 return jsonify({'error': 'Invalid product_id or quantity for an item'}), HTTP_400_BAD_REQUEST
            
#             product = Product.query.get(product_id)
#             if not product:
#                 db.session.rollback()
#                 return jsonify({'error': f'Product with ID {product_id} not found'}), HTTP_404_NOT_FOUND

#             if product.stock < quantity:
#                 db.session.rollback()
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             order_item = OrderItem(
#                 order_id=order_obj.id,
#                 product_id=product_id,
#                 quantity=quantity,
#                 price_at_time_of_purchase=product.price
#             )
#             total_price += order_item.price_at_time_of_purchase * quantity
#             db.session.add(order_item)

#         order_obj.total_price = total_price
#         db.session.commit()
#         return jsonify({'message': 'Order created successfully', 'order': serialize_order(order_obj)}), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         print(f"Error creating order for registered user: {e}")
#         return jsonify({'error': 'Internal server error creating order', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# @order.route('/', methods=['GET'])
# @jwt_required()
# def get_orders():
#     """
#     Retrieves all orders for the currently logged-in user.
#     """
#     user_id = get_jwt_identity()
#     orders = Order.query.filter_by(user_id=user_id).all()
#     return jsonify([serialize_order(o) for o in orders]), HTTP_200_OK

# @order.route('/<int:order_id>', methods=['GET'])
# @jwt_required()
# def get_order(order_id):
#     """
#     Retrieves a specific order by ID for the currently logged-in user.
#     Ensures the user can only access their own orders.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to view'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj)), HTTP_200_OK

# @order.route('/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def update_order_status(order_id):
#     """
#     Allows a user to update the status of their own order (e.g., 'cancelled').
#     Restricts status transitions (e.g., only pending orders can be cancelled).
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to update'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     status = data.get('status')
#     if not status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_transitions = {
#         'pending': ['cancelled'],
#     }

#     if status not in allowed_transitions.get(order_obj.status, []):
#         return jsonify({'error': f'Invalid status transition from "{order_obj.status}" to "{status}"'}), HTTP_400_BAD_REQUEST

#     order_obj.status = status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {status}'}), HTTP_200_OK

# @order.route('/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def delete_order(order_id):
#     """
#     Allows a user to delete their own order.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to delete'}), HTTP_404_NOT_FOUND

#     if order_obj.status not in ['pending', 'cancelled']:
#         return jsonify({'error': 'Only pending or cancelled orders can be deleted by user'}), HTTP_400_BAD_REQUEST

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK

# # --- ADMIN/SUPERADMIN ROUTES ---
# @order.route('/admin', methods=['GET'])
# @jwt_required()
# def admin_get_all_orders():
#     """
#     Admin/Superadmin only: Retrieves all orders in the system with pagination and optional search.
#     Includes full user details for each order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)
#     search_query = request.args.get('search', '', type=str).strip()
    
#     query = Order.query
    
#     if search_query:
#         # Search by order ID directly
#         try:
#             search_id = int(search_query)
#             query = query.filter(Order.id == search_id)
#         except ValueError:
#             # If search is not an int, search by email, name, or contact
#             query = query.join(User, isouter=True).filter(
#                 (Order.email.ilike(f'%{search_query}%')) |
#                 (Order.first_name.ilike(f'%{search_query}%')) |
#                 (Order.last_name.ilike(f'%{search_query}%')) |
#                 (Order.contact.ilike(f'%{search_query}%'))
#             )

#     paginated_orders = query.paginate(page=page, per_page=per_page, error_out=False)

#     return jsonify({
#         'orders': [serialize_order(o, include_user_details=True) for o in paginated_orders.items],
#         'total_orders': paginated_orders.total,
#         'pages': paginated_orders.pages,
#         'current_page': paginated_orders.page,
#         'per_page': paginated_orders.per_page
#     }), HTTP_200_OK

# @order.route('/admin/<int:order_id>', methods=['GET'])
# @jwt_required()
# def admin_get_order(order_id):
#     """
#     Admin/Superadmin only: Retrieves a specific order by ID.
#     Includes full user details for the order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj, include_user_details=True)), HTTP_200_OK

# @order.route('/admin/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def admin_update_order_status(order_id):
#     """
#     Admin/Superadmin only: Updates the status of any order.
#     If status changes to 'delivered', a Sale record is created AND stock is reduced.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     new_status = data.get('status')
#     if not new_status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
#     if new_status not in allowed_statuses:
#         return jsonify({'error': f'Invalid status. Allowed: {", ".join(allowed_statuses)}'}), HTTP_400_BAD_REQUEST

#     old_status = order_obj.status

#     if new_status == 'delivered' and old_status != 'delivered':
#         try:
#             for item in order_obj.order_items:
#                 product = Product.query.get(item.product_id)
#                 if not product:
#                     db.session.rollback()
#                     return jsonify({'error': f'Internal error: Product {item.product_id} not found.'}), HTTP_500_INTERNAL_SERVER_ERROR
                
#                 if product.stock < item.quantity:
#                     db.session.rollback()
#                     return jsonify({
#                         'error': f'Insufficient stock for product "{product.name}". Ordered: {item.quantity}, Available: {product.stock}. Order status not updated.'
#                     }), HTTP_400_BAD_REQUEST

#                 product.stock -= item.quantity
            
#             existing_sale = Sale.query.filter_by(order_id=order_obj.id).first()
#             if not existing_sale:
#                 sale = Sale(
#                     order_id=order_obj.id,
#                     amount=order_obj.total_price,
#                     sale_date=datetime.utcnow()
#                 )
#                 db.session.add(sale)

#         except Exception as e:
#             db.session.rollback()
#             print(f"CRITICAL ERROR: Exception during stock reduction or sale creation for order {order_obj.id}: {e}")
#             return jsonify({'error': 'Failed to process stock and sale record during status update', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

#     order_obj.status = new_status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {new_status}'}), HTTP_200_OK

# @order.route('/admin/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def admin_delete_order(order_id):
#     """
#     Admin/Superadmin only: Deletes an order and its associated items.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK












#DASHBOARD USER
# from flask import Blueprint, request, jsonify, current_app
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem
# from app.models.product import Product
# from app.models.user import User
# from app.extensions import db
# from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR,
#     HTTP_403_FORBIDDEN
# )
# from app.models.sale import Sale
# import json
# import os
# from werkzeug.utils import secure_filename

# # Define the order blueprint
# order = Blueprint('orders', __name__, url_prefix='/api/v1/orders')

# # Allowed file extensions for payment proof uploads
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # --- AUTH HELPER FUNCTIONS ---
# def is_admin_or_superadmin():
#     """
#     Helper function to check if the current user has an admin or super_admin role.
#     """
#     claims = get_jwt()
#     return claims.get('user_type') in ['admin', 'super_admin']

# # --- SERIALIZATION HELPER FUNCTIONS ---
# def serialize_order_item(order_item):
#     """
#     Serializes an OrderItem object, including details from the associated Product.
#     """
#     product = Product.query.get(order_item.product_id)
#     return {
#         'product_id': order_item.product_id,
#         'product_name': product.name if product else 'Unknown Product',
#         'product_image_url': product.image_url if product else None,
#         'quantity': order_item.quantity,
#         'price': str(product.price) if product else '0.00'  # Use current product price
#     }

# def serialize_order(o, include_user_details=False):
#     """
#     Serializes an Order object, aligning with the new Order model and frontend expectations.
#     """
#     order_data = {
#         'id': o.order_id,
#         'user_id': o.user_id,
#         'status': o.status,
#         'total': str(o.total_amount),
#         'payment_method': o.payment_method or 'cod',
#         'payment_proof_url': o.payment_proof_url,
#         'is_guest_order': o.user_id is None,
#         'created_at': o.created_at.isoformat() if o.created_at else None,
#         'updated_at': o.updated_at.isoformat() if o.updated_at else None,
#         'cart': [serialize_order_item(item) for item in o.items],
#         'customer_info': {
#             'name': o.customer_name,
#             'email': o.customer_email,
#             'contact': o.customer_phone,
#             'address': o.delivery_address,
#             'city': o.city or '',
#             'notes': o.special_notes or '',
#             'momoNumber': o.momo_number or '',
#             'momoNetwork': o.momo_network or ''
#         }
#     }
    
#     if include_user_details and o.user_id:
#         user = User.query.get(o.user_id)
#         order_data['user_details'] = {
#             'id': user.id,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'email': user.email,
#             'contact': user.contact,
#             'user_type': user.user_type
#         } if user else None
        
#     return order_data

# # --- CHECKOUT ROUTE ---
# @order.route('/checkout', methods=['POST'])
# @jwt_required(optional=True)
# def checkout():
#     """
#     Handles checkout for both authenticated and guest users.
#     Expects a FormData request with customerInfo, cart, total, and optional paymentProof.
#     """
#     try:
#         user_id = get_jwt_identity()
#         form_data = request.form
#         customer_info = json.loads(form_data.get('customerInfo', '{}'))
#         cart_items = json.loads(form_data.get('cart', '[]'))
#         total = float(form_data.get('total', 0))

#         # Map phone to contact
#         customer_info['contact'] = customer_info.pop('phone', '')

#         # Validate required fields
#         required_fields = ['name', 'email', 'contact', 'address']
#         if not all(customer_info.get(field) for field in required_fields):
#             return jsonify({'error': 'Missing required fields: name, email, contact, address'}), HTTP_400_BAD_REQUEST

#         if not cart_items or not isinstance(cart_items, list):
#             return jsonify({'error': 'Cart must be a non-empty list'}), HTTP_400_BAD_REQUEST

#         # Validate cart items
#         total_amount = 0
#         order_items_list = []
#         for item in cart_items:
#             product_id = item.get('id')
#             quantity = item.get('quantity', 1)
#             product = Product.query.get(product_id)

#             if not product or not isinstance(quantity, int) or quantity <= 0:
#                 return jsonify({'error': f'Invalid product_id or quantity for product {product_id}'}), HTTP_400_BAD_REQUEST
            
#             if product.stock < quantity:
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             total_amount += product.price * quantity
#             order_items_list.append({
#                 'product_id': product_id,
#                 'quantity': quantity
#             })

#         # Validate total
#         if abs(total_amount - total) > 0.01:
#             return jsonify({'error': 'Total price mismatch'}), HTTP_400_BAD_REQUEST

#         # Handle payment proof upload (if momo)
#         payment_proof_url = None
#         if customer_info.get('paymentMethod') == 'momo':
#             if 'paymentProof' not in request.files:
#                 return jsonify({'error': 'Payment proof required for Mobile Money transactions'}), HTTP_400_BAD_REQUEST
#             file = request.files['paymentProof']
#             if file and allowed_file(file.filename):
#                 ext = file.filename.rsplit('.', 1)[1].lower()
#                 filename = secure_filename(f"payment_proof_{user_id or 'guest'}_{int(datetime.utcnow().timestamp())}.{ext}")
#                 upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
#                 os.makedirs(upload_folder, exist_ok=True)
#                 file_path = os.path.join(upload_folder, filename)
#                 file.save(file_path)
#                 payment_proof_url = f"/uploads/{filename}"
#             else:
#                 return jsonify({'error': 'Invalid file type for payment proof. Allowed: png, jpg, jpeg, webp'}), HTTP_400_BAD_REQUEST

#         # Create order
#         order_obj = Order(
#             user_id=user_id if user_id else None,
#             customer_name=customer_info['name'],
#             customer_email=customer_info['email'],
#             customer_phone=customer_info['contact'],
#             delivery_address=customer_info['address'],
#             city=customer_info.get('city', ''),
#             special_notes=customer_info.get('notes', ''),
#             payment_method=customer_info.get('paymentMethod', 'cod'),
#             momo_number=customer_info.get('momoNumber', ''),
#             momo_network=customer_info.get('momoNetwork', ''),
#             payment_proof_url=payment_proof_url,
#             total_amount=total_amount,
#             status='pending'
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         # Create order items
#         for item_data in order_items_list:
#             order_item = OrderItem(
#                 order_id=order_obj.order_id,
#                 product_id=item_data['product_id'],
#                 quantity=item_data['quantity']
#             )
#             db.session.add(order_item)

#         db.session.commit()

#         return jsonify({
#             'success': True,
#             'message': 'Order placed successfully',
#             'order_id': order_obj.order_id,
#             'order': serialize_order(order_obj)
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Checkout error: {e}")
#         return jsonify({'error': 'Checkout failed', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- GUEST ORDER ROUTE ---
# @order.route('/guest', methods=['POST'])
# def create_guest_order():
#     """
#     Handles guest checkout by creating an order without a registered user.
#     """
#     try:
#         form_data = request.form
#         customer_info = json.loads(form_data.get('customerInfo', '{}'))
#         cart_items = json.loads(form_data.get('cart', '[]'))
#         total = float(form_data.get('total', 0))

#         # Map phone to contact
#         customer_info['contact'] = customer_info.pop('phone', '')

#         # Validate required fields
#         required_fields = ['name', 'email', 'contact', 'address']
#         if not all(customer_info.get(field) for field in required_fields):
#             return jsonify({'error': 'Missing required fields: name, email, contact, address'}), HTTP_400_BAD_REQUEST

#         if not cart_items or not isinstance(cart_items, list):
#             return jsonify({'error': 'Cart must be a non-empty list'}), HTTP_400_BAD_REQUEST

#         # Validate cart items
#         total_amount = 0
#         order_items_list = []
#         for item in cart_items:
#             product_id = item.get('id')
#             quantity = item.get('quantity', 1)
#             product = Product.query.get(product_id)

#             if not product or not isinstance(quantity, int) or quantity <= 0:
#                 return jsonify({'error': f'Invalid product_id or quantity for product {product_id}'}), HTTP_400_BAD_REQUEST
            
#             if product.stock < quantity:
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             total_amount += product.price * quantity
#             order_items_list.append({
#                 'product_id': product_id,
#                 'quantity': quantity
#             })

#         # Validate total
#         if abs(total_amount - total) > 0.01:
#             return jsonify({'error': 'Total price mismatch'}), HTTP_400_BAD_REQUEST

#         # Handle payment proof upload (if momo)
#         payment_proof_url = None
#         if customer_info.get('paymentMethod') == 'momo':
#             if 'paymentProof' not in request.files:
#                 return jsonify({'error': 'Payment proof required for Mobile Money transactions'}), HTTP_400_BAD_REQUEST
#             file = request.files['paymentProof']
#             if file and allowed_file(file.filename):
#                 ext = file.filename.rsplit('.', 1)[1].lower()
#                 filename = secure_filename(f"payment_proof_guest_{int(datetime.utcnow().timestamp())}.{ext}")
#                 upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
#                 os.makedirs(upload_folder, exist_ok=True)
#                 file_path = os.path.join(upload_folder, filename)
#                 file.save(file_path)
#                 payment_proof_url = f"/uploads/{filename}"
#             else:
#                 return jsonify({'error': 'Invalid file type for payment proof. Allowed: png, jpg, jpeg, webp'}), HTTP_400_BAD_REQUEST

#         # Create order
#         order_obj = Order(
#             user_id=None,
#             customer_name=customer_info['name'],
#             customer_email=customer_info['email'],
#             customer_phone=customer_info['contact'],
#             delivery_address=customer_info['address'],
#             city=customer_info.get('city', ''),
#             special_notes=customer_info.get('notes', ''),
#             payment_method=customer_info.get('paymentMethod', 'cod'),
#             momo_number=customer_info.get('momoNumber', ''),
#             momo_network=customer_info.get('momoNetwork', ''),
#             payment_proof_url=payment_proof_url,
#             total_amount=total_amount,
#             status='pending'
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         # Create order items
#         for item_data in order_items_list:
#             order_item = OrderItem(
#                 order_id=order_obj.order_id,
#                 product_id=item_data['product_id'],
#                 quantity=item_data['quantity']
#             )
#             db.session.add(order_item)

#         db.session.commit()

#         return jsonify({
#             'success': True,
#             'message': 'Guest order placed successfully',
#             'order_id': order_obj.order_id,
#             'order': serialize_order(order_obj)
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error creating guest order: {e}")
#         return jsonify({'error': 'An internal server error occurred.', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- USER ROUTES (for authenticated users) ---
# @order.route('/', methods=['POST'])
# @jwt_required()
# def create_order():
#     """
#     Creates a new order for the logged-in user.
#     """
#     user_id = get_jwt_identity()
#     data = request.get_json()

#     items_data = data.get('items')
#     if not items_data or not isinstance(items_data, list):
#         return jsonify({'error': 'Items must be a list'}), HTTP_400_BAD_REQUEST

#     if not items_data:
#         return jsonify({'error': 'Order must contain at least one item'}), HTTP_400_BAD_REQUEST

#     try:
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({'error': 'Authenticated user not found'}), HTTP_404_NOT_FOUND

#         total_amount = 0
#         order_obj = Order(
#             user_id=user_id,
#             status='pending',
#             customer_name=f"{user.first_name} {user.last_name}",
#             customer_email=user.email,
#             customer_phone=user.contact,
#             delivery_address=data.get('delivery_address')
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         for item_data in items_data:
#             product_id = item_data.get('product_id')
#             quantity = item_data.get('quantity', 1)

#             if not product_id or not isinstance(quantity, int) or quantity <= 0:
#                 db.session.rollback()
#                 return jsonify({'error': 'Invalid product_id or quantity for an item'}), HTTP_400_BAD_REQUEST
            
#             product = Product.query.get(product_id)
#             if not product:
#                 db.session.rollback()
#                 return jsonify({'error': f'Product with ID {product_id} not found'}), HTTP_404_NOT_FOUND

#             if product.stock < quantity:
#                 db.session.rollback()
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             order_item = OrderItem(
#                 order_id=order_obj.order_id,
#                 product_id=product_id,
#                 quantity=quantity
#             )
#             total_amount += product.price * quantity
#             db.session.add(order_item)

#         order_obj.total_amount = total_amount
#         db.session.commit()
#         return jsonify({'message': 'Order created successfully', 'order': serialize_order(order_obj)}), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error creating order for registered user: {e}")
#         return jsonify({'error': 'Internal server error creating order', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- Other routes remain unchanged ---
# @order.route('/', methods=['GET'])
# @jwt_required()
# def get_orders():
#     """
#     Retrieves all orders for the currently logged-in user.
#     """
#     user_id = get_jwt_identity()
#     orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
#     return jsonify({
#         'message': 'Orders retrieved successfully',
#         'orders': [serialize_order(o) for o in orders]
#     }), HTTP_200_OK

# @order.route('/<int:order_id>', methods=['GET'])
# @jwt_required()
# def get_order(order_id):
#     """
#     Retrieves a specific order by ID for the currently logged-in user.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to view'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj)), HTTP_200_OK

# @order.route('/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def update_order_status(order_id):
#     """
#     Allows a user to update the status of their own order (e.g., 'cancelled').
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to update'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     status = data.get('status')
#     if not status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_transitions = {
#         'pending': ['cancelled'],
#     }

#     if status not in allowed_transitions.get(order_obj.status, []):
#         return jsonify({'error': f'Invalid status transition from "{order_obj.status}" to "{status}"'}), HTTP_400_BAD_REQUEST

#     order_obj.status = status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {status}'}), HTTP_200_OK

# @order.route('/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def delete_order(order_id):
#     """
#     Allows a user to delete their own order.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to delete'}), HTTP_404_NOT_FOUND

#     if order_obj.status not in ['pending', 'cancelled']:
#         return jsonify({'error': 'Only pending or cancelled orders can be deleted by user'}), HTTP_400_BAD_REQUEST

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK

# # --- ADMIN/SUPERADMIN ROUTES ---
# @order.route('/admin', methods=['GET'])
# @jwt_required()
# def admin_get_all_orders():
#     """
#     Admin/Superadmin only: Retrieves all orders in the system with pagination and optional search.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)
#     search_query = request.args.get('search', '', type=str).strip()
    
#     query = Order.query
    
#     if search_query:
#         try:
#             search_id = int(search_query)
#             query = query.filter(Order.order_id == search_id)
#         except ValueError:
#             query = query.join(User, isouter=True).filter(
#                 (Order.customer_email.ilike(f'%{search_query}%')) |
#                 (Order.customer_name.ilike(f'%{search_query}%')) |
#                 (Order.customer_phone.ilike(f'%{search_query}%'))
#             )

#     paginated_orders = query.paginate(page=page, per_page=per_page, error_out=False)

#     return jsonify({
#         'orders': [serialize_order(o, include_user_details=True) for o in paginated_orders.items],
#         'total_orders': paginated_orders.total,
#         'pages': paginated_orders.pages,
#         'current_page': paginated_orders.page,
#         'per_page': paginated_orders.per_page
#     }), HTTP_200_OK

# @order.route('/admin/<int:order_id>', methods=['GET'])
# @jwt_required()
# def admin_get_order(order_id):
#     """
#     Admin/Superadmin only: Retrieves a specific order by ID.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj, include_user_details=True)), HTTP_200_OK

# @order.route('/admin/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def admin_update_order_status(order_id):
#     """
#     Admin/Superadmin only: Updates the status of any order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     new_status = data.get('status')
#     if not new_status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
#     if new_status not in allowed_statuses:
#         return jsonify({'error': f'Invalid status. Allowed: {", ".join(allowed_statuses)}'}), HTTP_400_BAD_REQUEST

#     old_status = order_obj.status

#     if new_status == 'delivered' and old_status != 'delivered':
#         try:
#             for item in order_obj.items:
#                 product = Product.query.get(item.product_id)
#                 if not product:
#                     db.session.rollback()
#                     return jsonify({'error': f'Internal error: Product {item.product_id} not found.'}), HTTP_500_INTERNAL_SERVER_ERROR
                
#                 if product.stock < item.quantity:
#                     db.session.rollback()
#                     return jsonify({
#                         'error': f'Insufficient stock for product "{product.name}". Ordered: {item.quantity}, Available: {product.stock}. Order status not updated.'
#                     }), HTTP_400_BAD_REQUEST

#                 product.stock -= item.quantity
            
#             existing_sale = Sale.query.filter_by(order_id=order_obj.order_id).first()
#             if not existing_sale:
#                 sale = Sale(
#                     order_id=order_obj.order_id,
#                     amount=order_obj.total_amount,
#                     sale_date=datetime.utcnow()
#                 )
#                 db.session.add(sale)

#         except Exception as e:
#             db.session.rollback()
#             current_app.logger.error(f"CRITICAL ERROR: Exception during stock reduction or sale creation for order {order_obj.order_id}: {e}")
#             return jsonify({'error': 'Failed to process stock and sale record during status update', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

#     order_obj.status = new_status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {new_status}'}), HTTP_200_OK

# @order.route('/admin/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def admin_delete_order(order_id):
#     """
#     Admin/Superadmin only: Deletes an order and its associated items.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK



# from flask import Blueprint, request, jsonify, current_app
# from datetime import datetime
# from app.models.order import Order
# from app.models.orderItem import OrderItem
# from app.models.product import Product
# from app.models.user import User
# from app.extensions import db
# from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR,
#     HTTP_403_FORBIDDEN
# )
# from app.models.sale import Sale
# import json
# import os
# from werkzeug.utils import secure_filename

# # Define the order blueprint
# order = Blueprint('orders', __name__, url_prefix='/api/v1/orders')

# # Allowed file extensions for payment proof uploads
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # --- AUTH HELPER FUNCTIONS ---
# def is_admin_or_superadmin():
#     """
#     Helper function to check if the current user has an admin or super_admin role.
#     """
#     claims = get_jwt()
#     return claims.get('user_type') in ['admin', 'super_admin']

# # --- SERIALIZATION HELPER FUNCTIONS ---
# def serialize_order_item(order_item):
#     """
#     Serializes an OrderItem object, including details from the associated Product.
#     """
#     product = Product.query.get(order_item.product_id)
#     return {
#         'product_id': order_item.product_id,
#         'product_name': product.name if product else 'Unknown Product',
#         'product_image_url': product.image_url if product else None,
#         'quantity': order_item.quantity,
#         'price': str(product.price) if product else '0.00'  # Use current product price
#     }

# def serialize_order(o, include_user_details=False):
#     """
#     Serializes an Order object, aligning with the new Order model and frontend expectations.
#     """
#     order_data = {
#         'id': o.order_id,
#         'user_id': o.user_id,
#         'status': o.status,
#         'total': str(o.total_amount),
#         'payment_method': o.payment_method or 'cod',
#         'payment_proof_url': o.payment_proof_url,
#         'is_guest_order': o.user_id is None,
#         'created_at': o.created_at.isoformat() if o.created_at else None,
#         'updated_at': o.updated_at.isoformat() if o.updated_at else None,
#         'cart': [serialize_order_item(item) for item in o.items],
#         'customer_info': {
#             'name': o.customer_name,
#             'email': o.customer_email,
#             'contact': o.customer_phone,
#             'address': o.delivery_address,
#             'city': o.city or '',
#             'notes': o.special_notes or '',
#             'momoNumber': o.momo_number or '',
#             'momoNetwork': o.momo_network or ''
#         }
#     }
    
#     if include_user_details and o.user_id:
#         user = User.query.get(o.user_id)
#         order_data['user_details'] = {
#             'id': user.id,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'email': user.email,
#             'contact': user.contact,
#             'user_type': user.user_type
#         } if user else None
        
#     return order_data

# # --- CHECKOUT ROUTE ---
# @order.route('/checkout', methods=['POST'])
# @jwt_required(optional=True)
# def checkout():
#     """
#     Handles checkout for both authenticated and guest users.
#     Expects a FormData request with customerInfo, cart, total, and optional paymentProof.
#     """
#     try:
#         user_id = get_jwt_identity()
#         form_data = request.form
#         customer_info = json.loads(form_data.get('customerInfo', '{}'))
#         cart_items = json.loads(form_data.get('cart', '[]'))
#         total = float(form_data.get('total', 0))

#         # Map phone to contact
#         customer_info['contact'] = customer_info.pop('phone', '')

#         # Validate required fields
#         required_fields = ['name', 'email', 'contact', 'address']
#         if not all(customer_info.get(field) for field in required_fields):
#             return jsonify({'error': 'Missing required fields: name, email, contact, address'}), HTTP_400_BAD_REQUEST

#         if not cart_items or not isinstance(cart_items, list):
#             return jsonify({'error': 'Cart must be a non-empty list'}), HTTP_400_BAD_REQUEST

#         # Validate cart items
#         total_amount = 0
#         order_items_list = []
#         for item in cart_items:
#             product_id = item.get('id')
#             quantity = item.get('quantity', 1)
#             product = Product.query.get(product_id)

#             if not product or not isinstance(quantity, int) or quantity <= 0:
#                 return jsonify({'error': f'Invalid product_id or quantity for product {product_id}'}), HTTP_400_BAD_REQUEST
            
#             if product.stock < quantity:
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             total_amount += product.price * quantity
#             order_items_list.append({
#                 'product_id': product_id,
#                 'quantity': quantity,
#                 'price': product.price  # Store the price
#             })

#         # Validate total
#         if abs(total_amount - total) > 0.01:
#             return jsonify({'error': 'Total price mismatch'}), HTTP_400_BAD_REQUEST

#         # Handle payment proof upload (if momo)
#         payment_proof_url = None
#         if customer_info.get('paymentMethod') == 'momo':
#             if 'paymentProof' not in request.files:
#                 return jsonify({'error': 'Payment proof required for Mobile Money transactions'}), HTTP_400_BAD_REQUEST
#             file = request.files['paymentProof']
#             if file and allowed_file(file.filename):
#                 ext = file.filename.rsplit('.', 1)[1].lower()
#                 filename = secure_filename(f"payment_proof_{user_id or 'guest'}_{int(datetime.utcnow().timestamp())}.{ext}")
#                 upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
#                 os.makedirs(upload_folder, exist_ok=True)
#                 file_path = os.path.join(upload_folder, filename)
#                 file.save(file_path)
#                 payment_proof_url = f"/uploads/{filename}"
#             else:
#                 return jsonify({'error': 'Invalid file type for payment proof. Allowed: png, jpg, jpeg, webp'}), HTTP_400_BAD_REQUEST

#         # Create order
#         order_obj = Order(
#             user_id=user_id if user_id else None,
#             customer_name=customer_info['name'],
#             customer_email=customer_info['email'],
#             customer_phone=customer_info['contact'],
#             delivery_address=customer_info['address'],
#             city=customer_info.get('city', ''),
#             special_notes=customer_info.get('notes', ''),
#             payment_method=customer_info.get('paymentMethod', 'cod'),
#             momo_number=customer_info.get('momoNumber', ''),
#             momo_network=customer_info.get('momoNetwork', ''),
#             payment_proof_url=payment_proof_url,
#             total_amount=total_amount,
#             status='pending'
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         # Create order items
#         for item_data in order_items_list:
#             order_item = OrderItem(
#                 order_id=order_obj.order_id,
#                 product_id=item_data['product_id'],
#                 quantity=item_data['quantity'],
#                 price=item_data['price']  # Use the stored price
#             )
#             db.session.add(order_item)

#         db.session.commit()

#         return jsonify({
#             'success': True,
#             'message': 'Order placed successfully',
#             'order_id': order_obj.order_id,
#             'order': serialize_order(order_obj)
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Checkout error: {e}")
#         return jsonify({'error': 'Checkout failed', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- GUEST ORDER ROUTE ---
# @order.route('/guest', methods=['POST'])
# def create_guest_order():
#     """
#     Handles guest checkout by creating an order without a registered user.
#     """
#     try:
#         form_data = request.form
#         customer_info = json.loads(form_data.get('customerInfo', '{}'))
#         cart_items = json.loads(form_data.get('cart', '[]'))
#         total = float(form_data.get('total', 0))

#         # Map phone to contact
#         customer_info['contact'] = customer_info.pop('phone', '')

#         # Validate required fields
#         required_fields = ['name', 'email', 'contact', 'address']
#         if not all(customer_info.get(field) for field in required_fields):
#             return jsonify({'error': 'Missing required fields: name, email, contact, address'}), HTTP_400_BAD_REQUEST

#         if not cart_items or not isinstance(cart_items, list):
#             return jsonify({'error': 'Cart must be a non-empty list'}), HTTP_400_BAD_REQUEST

#         # Validate cart items
#         total_amount = 0
#         order_items_list = []
#         for item in cart_items:
#             product_id = item.get('id')
#             quantity = item.get('quantity', 1)
#             product = Product.query.get(product_id)

#             if not product or not isinstance(quantity, int) or quantity <= 0:
#                 return jsonify({'error': f'Invalid product_id or quantity for product {product_id}'}), HTTP_400_BAD_REQUEST
            
#             if product.stock < quantity:
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             total_amount += product.price * quantity
#             order_items_list.append({
#                 'product_id': product_id,
#                 'quantity': quantity,
#                 'price': product.price  # Store the price
#             })

#         # Validate total
#         if abs(total_amount - total) > 0.01:
#             return jsonify({'error': 'Total price mismatch'}), HTTP_400_BAD_REQUEST

#         # Handle payment proof upload (if momo)
#         payment_proof_url = None
#         if customer_info.get('paymentMethod') == 'momo':
#             if 'paymentProof' not in request.files:
#                 return jsonify({'error': 'Payment proof required for Mobile Money transactions'}), HTTP_400_BAD_REQUEST
#             file = request.files['paymentProof']
#             if file and allowed_file(file.filename):
#                 ext = file.filename.rsplit('.', 1)[1].lower()
#                 filename = secure_filename(f"payment_proof_guest_{int(datetime.utcnow().timestamp())}.{ext}")
#                 upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
#                 os.makedirs(upload_folder, exist_ok=True)
#                 file_path = os.path.join(upload_folder, filename)
#                 file.save(file_path)
#                 payment_proof_url = f"/uploads/{filename}"
#             else:
#                 return jsonify({'error': 'Invalid file type for payment proof. Allowed: png, jpg, jpeg, webp'}), HTTP_400_BAD_REQUEST

#         # Create order
#         order_obj = Order(
#             user_id=None,
#             customer_name=customer_info['name'],
#             customer_email=customer_info['email'],
#             customer_phone=customer_info['contact'],
#             delivery_address=customer_info['address'],
#             city=customer_info.get('city', ''),
#             special_notes=customer_info.get('notes', ''),
#             payment_method=customer_info.get('paymentMethod', 'cod'),
#             momo_number=customer_info.get('momoNumber', ''),
#             momo_network=customer_info.get('momoNetwork', ''),
#             payment_proof_url=payment_proof_url,
#             total_amount=total_amount,
#             status='pending'
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         # Create order items
#         for item_data in order_items_list:
#             order_item = OrderItem(
#                 order_id=order_obj.order_id,
#                 product_id=item_data['product_id'],
#                 quantity=item_data['quantity'],
#                 price=item_data['price']  # Use the stored price
#             )
#             db.session.add(order_item)

#         db.session.commit()

#         return jsonify({
#             'success': True,
#             'message': 'Guest order placed successfully',
#             'order_id': order_obj.order_id,
#             'order': serialize_order(order_obj)
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error creating guest order: {e}")
#         return jsonify({'error': 'An internal server error occurred.', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- USER ROUTES (for authenticated users) ---
# @order.route('/', methods=['POST'])
# @jwt_required()
# def create_order():
#     """
#     Creates a new order for the logged-in user.
#     """
#     user_id = get_jwt_identity()
#     data = request.get_json()

#     items_data = data.get('items')
#     if not items_data or not isinstance(items_data, list):
#         return jsonify({'error': 'Items must be a list'}), HTTP_400_BAD_REQUEST

#     if not items_data:
#         return jsonify({'error': 'Order must contain at least one item'}), HTTP_400_BAD_REQUEST

#     try:
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({'error': 'Authenticated user not found'}), HTTP_404_NOT_FOUND

#         total_amount = 0
#         order_obj = Order(
#             user_id=user_id,
#             status='pending',
#             customer_name=f"{user.first_name} {user.last_name}",
#             customer_email=user.email,
#             customer_phone=user.contact,
#             delivery_address=data.get('delivery_address')
#         )
#         db.session.add(order_obj)
#         db.session.flush()

#         for item_data in items_data:
#             product_id = item_data.get('product_id')
#             quantity = item_data.get('quantity', 1)

#             if not product_id or not isinstance(quantity, int) or quantity <= 0:
#                 db.session.rollback()
#                 return jsonify({'error': 'Invalid product_id or quantity for an item'}), HTTP_400_BAD_REQUEST
            
#             product = Product.query.get(product_id)
#             if not product:
#                 db.session.rollback()
#                 return jsonify({'error': f'Product with ID {product_id} not found'}), HTTP_404_NOT_FOUND

#             if product.stock < quantity:
#                 db.session.rollback()
#                 return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

#             order_item = OrderItem(
#                 order_id=order_obj.order_id,
#                 product_id=product_id,
#                 quantity=quantity,
#                 price=product.price  # Add the product price
#             )
#             total_amount += product.price * quantity
#             db.session.add(order_item)

#         order_obj.total_amount = total_amount
#         db.session.commit()
#         return jsonify({'message': 'Order created successfully', 'order': serialize_order(order_obj)}), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error creating order for registered user: {e}")
#         return jsonify({'error': 'Internal server error creating order', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # --- Other routes remain unchanged ---
# @order.route('/', methods=['GET'])
# @jwt_required()
# def get_orders():
#     """
#     Retrieves all orders for the currently logged-in user.
#     """
#     user_id = get_jwt_identity()
#     orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
#     return jsonify({
#         'message': 'Orders retrieved successfully',
#         'orders': [serialize_order(o) for o in orders]
#     }), HTTP_200_OK

# @order.route('/<int:order_id>', methods=['GET'])
# @jwt_required()
# def get_order(order_id):
#     """
#     Retrieves a specific order by ID for the currently logged-in user.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to view'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj)), HTTP_200_OK

# @order.route('/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def update_order_status(order_id):
#     """
#     Allows a user to update the status of their own order (e.g., 'cancelled').
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to update'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     status = data.get('status')
#     if not status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_transitions = {
#         'pending': ['cancelled'],
#     }

#     if status not in allowed_transitions.get(order_obj.status, []):
#         return jsonify({'error': f'Invalid status transition from "{order_obj.status}" to "{status}"'}), HTTP_400_BAD_REQUEST

#     order_obj.status = status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {status}'}), HTTP_200_OK

# @order.route('/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def delete_order(order_id):
#     """
#     Allows a user to delete their own order.
#     """
#     user_id = get_jwt_identity()
#     order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
#     if not order_obj:
#         return jsonify({'error': 'Order not found or not authorized to delete'}), HTTP_404_NOT_FOUND

#     if order_obj.status not in ['pending', 'cancelled']:
#         return jsonify({'error': 'Only pending or cancelled orders can be deleted by user'}), HTTP_400_BAD_REQUEST

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK

# # --- ADMIN/SUPERADMIN ROUTES ---
# @order.route('/admin', methods=['GET'])
# @jwt_required()
# def admin_get_all_orders():
#     """
#     Admin/Superadmin only: Retrieves all orders in the system with pagination and optional search.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)
#     search_query = request.args.get('search', '', type=str).strip()
    
#     query = Order.query
    
#     if search_query:
#         try:
#             search_id = int(search_query)
#             query = query.filter(Order.order_id == search_id)
#         except ValueError:
#             query = query.join(User, isouter=True).filter(
#                 (Order.customer_email.ilike(f'%{search_query}%')) |
#                 (Order.customer_name.ilike(f'%{search_query}%')) |
#                 (Order.customer_phone.ilike(f'%{search_query}%'))
#             )

#     paginated_orders = query.paginate(page=page, per_page=per_page, error_out=False)

#     return jsonify({
#         'orders': [serialize_order(o, include_user_details=True) for o in paginated_orders.items],
#         'total_orders': paginated_orders.total,
#         'pages': paginated_orders.pages,
#         'current_page': paginated_orders.page,
#         'per_page': paginated_orders.per_page
#     }), HTTP_200_OK

# @order.route('/admin/<int:order_id>', methods=['GET'])
# @jwt_required()
# def admin_get_order(order_id):
#     """
#     Admin/Superadmin only: Retrieves a specific order by ID.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     return jsonify(serialize_order(order_obj, include_user_details=True)), HTTP_200_OK

# @order.route('/admin/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def admin_update_order_status(order_id):
#     """
#     Admin/Superadmin only: Updates the status of any order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     new_status = data.get('status')
#     if not new_status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
#     if new_status not in allowed_statuses:
#         return jsonify({'error': f'Invalid status. Allowed: {", ".join(allowed_statuses)}'}), HTTP_400_BAD_REQUEST

#     old_status = order_obj.status

#     if new_status == 'delivered' and old_status != 'delivered':
#         try:
#             for item in order_obj.items:
#                 product = Product.query.get(item.product_id)
#                 if not product:
#                     db.session.rollback()
#                     return jsonify({'error': f'Internal error: Product {item.product_id} not found.'}), HTTP_500_INTERNAL_SERVER_ERROR
                
#                 if product.stock < item.quantity:
#                     db.session.rollback()
#                     return jsonify({
#                         'error': f'Insufficient stock for product "{product.name}". Ordered: {item.quantity}, Available: {product.stock}. Order status not updated.'
#                     }), HTTP_400_BAD_REQUEST

#                 product.stock -= item.quantity
            
#             existing_sale = Sale.query.filter_by(order_id=order_obj.order_id).first()
#             if not existing_sale:
#                 sale = Sale(
#                     order_id=order_obj.order_id,
#                     amount=order_obj.total_amount,
#                     sale_date=datetime.utcnow()
#                 )
#                 db.session.add(sale)

#         except Exception as e:
#             db.session.rollback()
#             current_app.logger.error(f"CRITICAL ERROR: Exception during stock reduction or sale creation for order {order_obj.order_id}: {e}")
#             return jsonify({'error': 'Failed to process stock and sale record during status update', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

#     order_obj.status = new_status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {new_status}'}), HTTP_200_OK

# @order.route('/admin/<int:order_id>', methods=['DELETE'])
# @jwt_required()
# def admin_delete_order(order_id):
#     """
#     Admin/Superadmin only: Deletes an order and its associated items.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     db.session.delete(order_obj)
#     db.session.commit()
#     return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK







from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.models.product import Product
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_403_FORBIDDEN
)
from app.models.sale import Sale
import json
import os
from werkzeug.utils import secure_filename

# Define the order blueprint
order = Blueprint('orders', __name__, url_prefix='/api/v1/orders')

# Allowed file extensions for payment proof uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- AUTH HELPER FUNCTIONS ---
def is_admin_or_superadmin():
    """
    Helper function to check if the current user has an admin or super_admin role.
    """
    claims = get_jwt()
    return claims.get('user_type') in ['admin', 'super_admin']

# --- SERIALIZATION HELPER FUNCTIONS ---
def serialize_order_item(order_item):
    """
    Serializes an OrderItem object, including details from the associated Product.
    """
    product = Product.query.get(order_item.product_id)
    return {
        'product_id': order_item.product_id,
        'product_name': product.name if product else 'Unknown Product',
        'product_image_url': product.image_url if product else None,
        'quantity': order_item.quantity,
        'price': str(product.price) if product else '0.00'  # Use current product price
    }

def serialize_order(o, include_user_details=False):
    """
    Serializes an Order object, aligning with the new Order model and frontend expectations.
    FIXED: Added order_id field for frontend compatibility.
    """
    order_data = {
        'id': o.order_id,
        'order_id': o.order_id,  # ADDED: Frontend expects this field
        'user_id': o.user_id,
        'status': o.status,
        'total': str(o.total_amount),
        'payment_method': o.payment_method or 'cod',
        'payment_proof_url': o.payment_proof_url,
        'is_guest_order': o.user_id is None,
        'created_at': o.created_at.isoformat() if o.created_at else None,
        'updated_at': o.updated_at.isoformat() if o.updated_at else None,
        'cart': [serialize_order_item(item) for item in o.items],
        'customer_info': {
            'name': o.customer_name,
            'email': o.customer_email,
            'contact': o.customer_phone,
            'address': o.delivery_address,
            'city': o.city or '',
            'notes': o.special_notes or '',
            'momoNumber': o.momo_number or '',
            'momoNetwork': o.momo_network or ''
        }
    }
    
    if include_user_details and o.user_id:
        user = User.query.get(o.user_id)
        order_data['user_details'] = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'contact': user.contact,
            'user_type': user.user_type
        } if user else None
        
    return order_data

# --- CHECKOUT ROUTE ---
@order.route('/checkout', methods=['POST'])
@jwt_required(optional=True)
def checkout():
    """
    Handles checkout for both authenticated and guest users.
    Expects a FormData request with customerInfo, cart, total, and optional paymentProof.
    """
    try:
        user_id = get_jwt_identity()
        form_data = request.form
        customer_info = json.loads(form_data.get('customerInfo', '{}'))
        cart_items = json.loads(form_data.get('cart', '[]'))
        total = float(form_data.get('total', 0))

        # Map phone to contact
        customer_info['contact'] = customer_info.pop('phone', '')

        # Validate required fields
        required_fields = ['name', 'email', 'contact', 'address']
        if not all(customer_info.get(field) for field in required_fields):
            return jsonify({'error': 'Missing required fields: name, email, contact, address'}), HTTP_400_BAD_REQUEST

        if not cart_items or not isinstance(cart_items, list):
            return jsonify({'error': 'Cart must be a non-empty list'}), HTTP_400_BAD_REQUEST

        # Validate cart items
        total_amount = 0
        order_items_list = []
        for item in cart_items:
            product_id = item.get('id')
            quantity = item.get('quantity', 1)
            product = Product.query.get(product_id)

            if not product or not isinstance(quantity, int) or quantity <= 0:
                return jsonify({'error': f'Invalid product_id or quantity for product {product_id}'}), HTTP_400_BAD_REQUEST
            
            if product.stock < quantity:
                return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

            total_amount += product.price * quantity
            order_items_list.append({
                'product_id': product_id,
                'quantity': quantity,
                'price': product.price  # Store the price
            })

        # Validate total
        if abs(total_amount - total) > 0.01:
            return jsonify({'error': 'Total price mismatch'}), HTTP_400_BAD_REQUEST

        # Handle payment proof upload (if momo)
        payment_proof_url = None
        if customer_info.get('paymentMethod') == 'momo':
            if 'paymentProof' not in request.files:
                return jsonify({'error': 'Payment proof required for Mobile Money transactions'}), HTTP_400_BAD_REQUEST
            file = request.files['paymentProof']
            if file and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = secure_filename(f"payment_proof_{user_id or 'guest'}_{int(datetime.utcnow().timestamp())}.{ext}")
                upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
                os.makedirs(upload_folder, exist_ok=True)
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                payment_proof_url = f"/uploads/{filename}"
            else:
                return jsonify({'error': 'Invalid file type for payment proof. Allowed: png, jpg, jpeg, webp'}), HTTP_400_BAD_REQUEST

        # Create order
        order_obj = Order(
            user_id=user_id if user_id else None,
            customer_name=customer_info['name'],
            customer_email=customer_info['email'],
            customer_phone=customer_info['contact'],
            delivery_address=customer_info['address'],
            city=customer_info.get('city', ''),
            special_notes=customer_info.get('notes', ''),
            payment_method=customer_info.get('paymentMethod', 'cod'),
            momo_number=customer_info.get('momoNumber', ''),
            momo_network=customer_info.get('momoNetwork', ''),
            payment_proof_url=payment_proof_url,
            total_amount=total_amount,
            status='pending'
        )
        db.session.add(order_obj)
        db.session.flush()

        # Create order items
        for item_data in order_items_list:
            order_item = OrderItem(
                order_id=order_obj.order_id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_data['price']  # Use the stored price
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Order placed successfully',
            'order_id': order_obj.order_id,
            'order': serialize_order(order_obj)
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Checkout error: {e}")
        return jsonify({'error': 'Checkout failed', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# --- GUEST ORDER ROUTE ---
@order.route('/guest', methods=['POST'])
def create_guest_order():
    """
    Handles guest checkout by creating an order without a registered user.
    """
    try:
        form_data = request.form
        customer_info = json.loads(form_data.get('customerInfo', '{}'))
        cart_items = json.loads(form_data.get('cart', '[]'))
        total = float(form_data.get('total', 0))

        # Map phone to contact
        customer_info['contact'] = customer_info.pop('phone', '')

        # Validate required fields
        required_fields = ['name', 'email', 'contact', 'address']
        if not all(customer_info.get(field) for field in required_fields):
            return jsonify({'error': 'Missing required fields: name, email, contact, address'}), HTTP_400_BAD_REQUEST

        if not cart_items or not isinstance(cart_items, list):
            return jsonify({'error': 'Cart must be a non-empty list'}), HTTP_400_BAD_REQUEST

        # Validate cart items
        total_amount = 0
        order_items_list = []
        for item in cart_items:
            product_id = item.get('id')
            quantity = item.get('quantity', 1)
            product = Product.query.get(product_id)

            if not product or not isinstance(quantity, int) or quantity <= 0:
                return jsonify({'error': f'Invalid product_id or quantity for product {product_id}'}), HTTP_400_BAD_REQUEST
            
            if product.stock < quantity:
                return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

            total_amount += product.price * quantity
            order_items_list.append({
                'product_id': product_id,
                'quantity': quantity,
                'price': product.price  # Store the price
            })

        # Validate total
        if abs(total_amount - total) > 0.01:
            return jsonify({'error': 'Total price mismatch'}), HTTP_400_BAD_REQUEST

        # Handle payment proof upload (if momo)
        payment_proof_url = None
        if customer_info.get('paymentMethod') == 'momo':
            if 'paymentProof' not in request.files:
                return jsonify({'error': 'Payment proof required for Mobile Money transactions'}), HTTP_400_BAD_REQUEST
            file = request.files['paymentProof']
            if file and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = secure_filename(f"payment_proof_guest_{int(datetime.utcnow().timestamp())}.{ext}")
                upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
                os.makedirs(upload_folder, exist_ok=True)
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                payment_proof_url = f"/uploads/{filename}"
            else:
                return jsonify({'error': 'Invalid file type for payment proof. Allowed: png, jpg, jpeg, webp'}), HTTP_400_BAD_REQUEST

        # Create order
        order_obj = Order(
            user_id=None,
            customer_name=customer_info['name'],
            customer_email=customer_info['email'],
            customer_phone=customer_info['contact'],
            delivery_address=customer_info['address'],
            city=customer_info.get('city', ''),
            special_notes=customer_info.get('notes', ''),
            payment_method=customer_info.get('paymentMethod', 'cod'),
            momo_number=customer_info.get('momoNumber', ''),
            momo_network=customer_info.get('momoNetwork', ''),
            payment_proof_url=payment_proof_url,
            total_amount=total_amount,
            status='pending'
        )
        db.session.add(order_obj)
        db.session.flush()

        # Create order items
        for item_data in order_items_list:
            order_item = OrderItem(
                order_id=order_obj.order_id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_data['price']  # Use the stored price
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Guest order placed successfully',
            'order_id': order_obj.order_id,
            'order': serialize_order(order_obj)
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating guest order: {e}")
        return jsonify({'error': 'An internal server error occurred.', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# --- USER ROUTES (for authenticated users) ---
@order.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """
    Creates a new order for the logged-in user.
    """
    user_id = get_jwt_identity()
    data = request.get_json()

    items_data = data.get('items')
    if not items_data or not isinstance(items_data, list):
        return jsonify({'error': 'Items must be a list'}), HTTP_400_BAD_REQUEST

    if not items_data:
        return jsonify({'error': 'Order must contain at least one item'}), HTTP_400_BAD_REQUEST

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Authenticated user not found'}), HTTP_404_NOT_FOUND

        total_amount = 0
        order_obj = Order(
            user_id=user_id,
            status='pending',
            customer_name=f"{user.first_name} {user.last_name}",
            customer_email=user.email,
            customer_phone=user.contact,
            delivery_address=data.get('delivery_address')
        )
        db.session.add(order_obj)
        db.session.flush()

        for item_data in items_data:
            product_id = item_data.get('product_id')
            quantity = item_data.get('quantity', 1)

            if not product_id or not isinstance(quantity, int) or quantity <= 0:
                db.session.rollback()
                return jsonify({'error': 'Invalid product_id or quantity for an item'}), HTTP_400_BAD_REQUEST
            
            product = Product.query.get(product_id)
            if not product:
                db.session.rollback()
                return jsonify({'error': f'Product with ID {product_id} not found'}), HTTP_404_NOT_FOUND

            if product.stock < quantity:
                db.session.rollback()
                return jsonify({'error': f'Insufficient stock for product "{product.name}". Only {product.stock} available.'}), HTTP_400_BAD_REQUEST

            order_item = OrderItem(
                order_id=order_obj.order_id,
                product_id=product_id,
                quantity=quantity,
                price=product.price  # Add the product price
            )
            total_amount += product.price * quantity
            db.session.add(order_item)

        order_obj.total_amount = total_amount
        db.session.commit()
        return jsonify({'message': 'Order created successfully', 'order': serialize_order(order_obj)}), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating order for registered user: {e}")
        return jsonify({'error': 'Internal server error creating order', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# --- Other routes remain unchanged ---
@order.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """
    Retrieves all orders for the currently logged-in user.
    """
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify({
        'message': 'Orders retrieved successfully',
        'orders': [serialize_order(o) for o in orders]
    }), HTTP_200_OK

@order.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """
    Retrieves a specific order by ID for the currently logged-in user.
    """
    user_id = get_jwt_identity()
    order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order_obj:
        return jsonify({'error': 'Order not found or not authorized to view'}), HTTP_404_NOT_FOUND

    return jsonify(serialize_order(order_obj)), HTTP_200_OK

@order.route('/<int:order_id>/status', methods=['PATCH'])
@jwt_required()
def update_order_status(order_id):
    """
    Allows a user to update the status of their own order (e.g., 'cancelled').
    """
    user_id = get_jwt_identity()
    order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order_obj:
        return jsonify({'error': 'Order not found or not authorized to update'}), HTTP_404_NOT_FOUND

    data = request.get_json()
    status = data.get('status')
    if not status:
        return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

    allowed_transitions = {
        'pending': ['cancelled'],
    }

    if status not in allowed_transitions.get(order_obj.status, []):
        return jsonify({'error': f'Invalid status transition from "{order_obj.status}" to "{status}"'}), HTTP_400_BAD_REQUEST

    order_obj.status = status
    db.session.commit()
    return jsonify({'message': f'Order status updated to {status}'}), HTTP_200_OK

@order.route('/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    """
    Allows a user to delete their own order.
    """
    user_id = get_jwt_identity()
    order_obj = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order_obj:
        return jsonify({'error': 'Order not found or not authorized to delete'}), HTTP_404_NOT_FOUND

    if order_obj.status not in ['pending', 'cancelled']:
        return jsonify({'error': 'Only pending or cancelled orders can be deleted by user'}), HTTP_400_BAD_REQUEST

    db.session.delete(order_obj)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK

# --- ADMIN/SUPERADMIN ROUTES ---
@order.route('/admin', methods=['GET'])
@jwt_required()
def admin_get_all_orders():
    """
    Admin/Superadmin only: Retrieves all orders in the system with pagination and optional search.
    """
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search_query = request.args.get('search', '', type=str).strip()
    
    query = Order.query
    
    if search_query:
        try:
            search_id = int(search_query)
            query = query.filter(Order.order_id == search_id)
        except ValueError:
            query = query.join(User, isouter=True).filter(
                (Order.customer_email.ilike(f'%{search_query}%')) |
                (Order.customer_name.ilike(f'%{search_query}%')) |
                (Order.customer_phone.ilike(f'%{search_query}%'))
            )

    paginated_orders = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'orders': [serialize_order(o, include_user_details=True) for o in paginated_orders.items],
        'total_orders': paginated_orders.total,
        'pages': paginated_orders.pages,
        'current_page': paginated_orders.page,
        'per_page': paginated_orders.per_page
    }), HTTP_200_OK

@order.route('/admin/<int:order_id>', methods=['GET'])
@jwt_required()
def admin_get_order(order_id):
    """
    Admin/Superadmin only: Retrieves a specific order by ID.
    """
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    order_obj = Order.query.get(order_id)
    if not order_obj:
        return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

    return jsonify(serialize_order(order_obj, include_user_details=True)), HTTP_200_OK

# @order.route('/admin/<int:order_id>/status', methods=['PATCH'])
# @jwt_required()
# def admin_update_order_status(order_id):
#     """
#     Admin/Superadmin only: Updates the status of any order.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
#     new_status = data.get('status')
#     if not new_status:
#         return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

#     allowed_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
#     if new_status not in allowed_statuses:
#         return jsonify({'error': f'Invalid status. Allowed: {", ".join(allowed_statuses)}'}), HTTP_400_BAD_REQUEST

#     old_status = order_obj.status

#     if new_status == 'delivered' and old_status != 'delivered':
#         try:
#             for item in order_obj.items:
#                 product = Product.query.get(item.product_id)
#                 if not product:
#                     db.session.rollback()
#                     return jsonify({'error': f'Internal error: Product {item.product_id} not found.'}), HTTP_500_INTERNAL_SERVER_ERROR
                
#                 if product.stock < item.quantity:
#                     db.session.rollback()
#                     return jsonify({
#                         'error': f'Insufficient stock for product "{product.name}". Ordered: {item.quantity}, Available: {product.stock}. Order status not updated.'
#                     }), HTTP_400_BAD_REQUEST

#                 product.stock -= item.quantity
            
#             existing_sale = Sale.query.filter_by(order_id=order_obj.order_id).first()
#             if not existing_sale:
#                 sale = Sale(
#                     order_id=order_obj.order_id,
#                     amount=order_obj.total_amount,
#                     sale_date=datetime.utcnow()
#                 )
#                 db.session.add(sale)

#         except Exception as e:
#             db.session.rollback()
#             current_app.logger.error(f"CRITICAL ERROR: Exception during stock reduction or sale creation for order {order_obj.order_id}: {e}")
#             return jsonify({'error': 'Failed to process stock and sale record during status update', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

#     order_obj.status = new_status
#     db.session.commit()
#     return jsonify({'message': f'Order status updated to {new_status}'}), HTTP_200_OK


@order.route('/admin/<int:order_id>/status', methods=['PATCH'])
@jwt_required()
def admin_update_order_status(order_id):
    """
    Admin/Superadmin only: Updates the status of any order and creates a sale if delivered.
    """
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    order_obj = Order.query.get(order_id)
    if not order_obj:
        return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

    data = request.get_json()
    new_status = data.get('status')
    if not new_status:
        return jsonify({'error': 'Status is required'}), HTTP_400_BAD_REQUEST

    allowed_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if new_status not in allowed_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {", ".join(allowed_statuses)}'}), HTTP_400_BAD_REQUEST

    old_status = order_obj.status

    if new_status == 'delivered' and old_status != 'delivered':
        try:
            # Step 1: Validate and update stock
            for item in order_obj.items:
                product = Product.query.get(item.product_id)
                if not product:
                    db.session.rollback()
                    return jsonify({'error': f'Internal error: Product {item.product_id} not found.'}), HTTP_500_INTERNAL_SERVER_ERROR
                
                if product.stock < item.quantity:
                    db.session.rollback()
                    return jsonify({
                        'error': f'Insufficient stock for product "{product.name}". Ordered: {item.quantity}, Available: {product.stock}.'
                    }), HTTP_400_BAD_REQUEST

                product.stock -= item.quantity
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Stock reduction error for order {order_id}: {str(e)}")
            return jsonify({'error': 'Failed to update product stock', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

        try:
            # Step 2: Create sale if none exists
            existing_sale = Sale.query.filter_by(order_id=order_obj.order_id).first()
            if not existing_sale:
                sale = Sale(
                    order_id=order_obj.order_id,
                    amount=order_obj.total_amount,
                    sale_date=datetime.utcnow(),
                    user_id=order_obj.user_id  # Include user_id from order
                )
                db.session.add(sale)
                current_app.logger.info(f"Sale created for order_id {order_obj.order_id}")
            else:
                current_app.logger.warning(f"Sale already exists for order_id {order_obj.order_id}")
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Sale creation error for order {order_id}: {str(e)}")
            return jsonify({'error': 'Failed to create sale record', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

    order_obj.status = new_status
    order_obj.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': f'Order status updated to {new_status}'}), HTTP_200_OK




@order.route('/admin/<int:order_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_order(order_id):
    """
    Admin/Superadmin only: Deletes an order and its associated items.
    """
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    order_obj = Order.query.get(order_id)
    if not order_obj:
        return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

    db.session.delete(order_obj)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), HTTP_200_OK







@order.route('/admin/<int:order_id>/edit', methods=['PUT'])
@jwt_required()
def admin_edit_order(order_id):
    """
    Admin/Superadmin only: Edit order details including customer info and items.
    """
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    order_obj = Order.query.get(order_id)
    if not order_obj:
        return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

    data = request.get_json()
    
    try:
        # Update customer information
        customer_info = data.get('customer_info', {})
        if customer_info:
            order_obj.customer_name = customer_info.get('name', order_obj.customer_name)
            order_obj.customer_email = customer_info.get('email', order_obj.customer_email)
            order_obj.customer_phone = customer_info.get('contact', order_obj.customer_phone)
            order_obj.delivery_address = customer_info.get('address', order_obj.delivery_address)
            order_obj.city = customer_info.get('city', order_obj.city)
            order_obj.special_notes = customer_info.get('notes', order_obj.special_notes)
            order_obj.momo_number = customer_info.get('momo_number', order_obj.momo_number)
            order_obj.momo_network = customer_info.get('momo_network', order_obj.momo_network)

        # Update payment method
        payment_method = data.get('payment_method')
        if payment_method:
            order_obj.payment_method = payment_method

        # Update cart items if provided
        cart = data.get('cart')
        if cart is not None:
            # Remove existing order items
            OrderItem.query.filter_by(order_id=order_obj.order_id).delete()
            
            # Add updated items and recalculate total
            total_amount = 0
            for item_data in cart:
                product = Product.query.get(item_data['product_id'])
                if product:
                    order_item = OrderItem(
                        order_id=order_obj.order_id,
                        product_id=item_data['product_id'],
                        quantity=item_data['quantity'],
                        price=item_data['price']
                    )
                    db.session.add(order_item)
                    total_amount += float(item_data['price']) * item_data['quantity']
            
            order_obj.total_amount = total_amount

        order_obj.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Order updated successfully',
            'order': serialize_order(order_obj, include_user_details=True)
        }), HTTP_200_OK

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating order {order_id}: {e}")
        return jsonify({'error': 'Failed to update order', 'details': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR