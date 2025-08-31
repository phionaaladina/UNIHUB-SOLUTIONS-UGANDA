from flask import Blueprint, request, jsonify
from app.models.sale import Sale
from app.models.order import Order # Needed to get order details
from app.models.user import User # Needed to get user details for the order
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt # get_jwt for claims
from datetime import datetime # Needed for isoformat()

from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_409_CONFLICT, HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
)

# Define the sales blueprint (keeping your name and url_prefix)
sale = Blueprint('sale', __name__, url_prefix='/api/v1/sales')

# Helper function for consistent admin/super_admin check
def is_admin_or_superadmin():
    """
    Helper function to check if the current user has admin or super_admin role.
    """
    claims = get_jwt()
    # Ensure 'user_type' is used as defined in auth.py, and 'super_admin' spelling is consistent
    return claims.get('user_type') in ['admin', 'super_admin']

# --- HELPER FUNCTION FOR SALE SERIALIZATION ---
def serialize_sale(s, include_order_details=False):
    """
    Serializes a Sale object, optionally including associated Order and User details.
    """
    sale_data = {
        'sale_id': s.sale_id,
        'order_id': s.order_id,
        'amount': str(s.amount), # Convert Float/Decimal to string for JSON compatibility
        'sale_date': s.sale_date.isoformat() if s.sale_date else None,
    }

    if include_order_details:
        order_obj = Order.query.get(s.order_id)
        if order_obj:
            sale_data['order_details'] = {
                'status': order_obj.status,
                'total_amount': str(order_obj.total_amount),
                'created_at': order_obj.created_at.isoformat() if order_obj.created_at else None,
                'updated_at': order_obj.updated_at.isoformat() if order_obj.updated_at else None,
            }
            user = User.query.get(order_obj.user_id)
            if user:
                sale_data['user_details'] = {
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'user_type': user.user_type
                }
            else:
                sale_data['user_details'] = None # User not found
        else:
            sale_data['order_details'] = None # Order not found

    return sale_data


# --- USER/INTERNAL ROUTES (if applicable, though sales are usually admin-managed) ---

# Create a sale (after an order is confirmed/paid) - this is typically handled by order status update
@sale.route('/create', methods=['POST'])
@jwt_required()
def create_sale():
    data = request.get_json()
    order_id = data.get('order_id')
    amount = data.get('amount')

    if not order_id or not amount:
        return jsonify({'error': 'order_id and amount are required'}), HTTP_400_BAD_REQUEST

    # Check if order exists
    order_obj = Order.query.get(order_id)
    if not order_obj:
        return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

    # Optional: check if sale for this order already exists to prevent duplicates
    existing_sale = Sale.query.filter_by(order_id=order_id).first()
    if existing_sale:
        return jsonify({'error': 'Sale for this order already exists'}), HTTP_409_CONFLICT

    new_sale = Sale(order_id=order_id, amount=amount)

    try:
        db.session.add(new_sale)
        db.session.commit()
        return jsonify({'message': 'Sale created', 'sale_id': new_sale.sale_id}), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        print(f"Error creating sale: {e}")
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Get sale by sale_id (can be accessed by admin or potentially the user who placed the order)
@sale.route('/<int:sale_id>', methods=['GET'])
@jwt_required()
def get_sale(sale_id):
    sale_obj = Sale.query.get_or_404(sale_id)
    return jsonify(serialize_sale(sale_obj, include_order_details=True)), HTTP_200_OK


# Update sale (e.g. correct amount) - typically admin-only
@sale.route('/<int:sale_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_sale(sale_id):
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    sale_obj = Sale.query.get_or_404(sale_id)
    data = request.get_json()

    amount = data.get('amount')
    if amount is not None:
        sale_obj.amount = amount

    try:
        db.session.commit()
        return jsonify({'message': 'Sale updated'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error updating sale: {e}")
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Delete sale - typically admin-only
@sale.route('/<int:sale_id>', methods=['DELETE'])
@jwt_required()
def delete_sale(sale_id):
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    sale_obj = Sale.query.get_or_404(sale_id)
    try:
        db.session.delete(sale_obj)
        db.session.commit()
        return jsonify({'message': 'Sale deleted'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting sale: {e}")
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# Get all sales (admin/super_admin only) - MODIFIED FOR DASHBOARD
@sale.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_all_sales():
    """
    Admin/Superadmin only: Retrieves all sales in the system with optional search,
    pagination, or all data for analytics.
    """
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    # Check for the 'all_sales' parameter, typically used for dashboards/analytics
    all_sales_flag = request.args.get('all_sales', 'false').lower() == 'true'
    search_query = request.args.get('search', '', type=str)
    
    query = Sale.query

    if search_query:
        # Your existing search logic
        try:
            search_id = int(search_query)
            query = query.filter(Sale.sale_id == search_id)
        except ValueError:
            query = query.join(Order, Sale.order_id == Order.order_id)
            query = query.join(User, Order.user_id == User.id).filter(
                (User.email.ilike(f'%{search_query}%')) |
                (User.first_name.ilike(f'%{search_query}%')) |
                (User.last_name.ilike(f'%{search_query}%')) |
                (Order.order_id == search_query)
            )

    # Order by sale_date descending for most recent sales first
    query = query.order_by(Sale.sale_date.desc())

    if all_sales_flag:
        # Return all sales without pagination
        sales_items = query.all()
        total_sales = len(sales_items)
        pages = 1
        current_page = 1
        per_page = total_sales
    else:
        # Use pagination for the table view
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        paginated_sales = query.paginate(page=page, per_page=per_page, error_out=False)
        sales_items = paginated_sales.items
        total_sales = paginated_sales.total
        pages = paginated_sales.pages
        current_page = paginated_sales.page
        per_page = paginated_sales.per_page

    return jsonify({
        'sales': [serialize_sale(s, include_order_details=True) for s in sales_items],
        'total_sales': total_sales,
        'pages': pages,
        'current_page': current_page,
        'per_page': per_page
    }), HTTP_200_OK

















# # app/routes/sales.py
# from flask import Blueprint, request, jsonify
# from app.models.sale import Sale
# from app.models.order import Order # Needed to get order details
# from app.models.user import User # Needed to get user details for the order
# from app.extensions import db
# from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt # get_jwt for claims
# from datetime import datetime # Needed for isoformat()

# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_409_CONFLICT, HTTP_404_NOT_FOUND,
#     HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
# )

# # Define the sales blueprint (keeping your name and url_prefix)
# sale = Blueprint('sale', __name__, url_prefix='/api/v1/sales')

# # Helper function for consistent admin/super_admin check
# def is_admin_or_superadmin():
#     """
#     Helper function to check if the current user has admin or super_admin role.
#     """
#     claims = get_jwt()
#     # Ensure 'user_type' is used as defined in auth.py, and 'super_admin' spelling is consistent
#     return claims.get('user_type') in ['admin', 'super_admin']

# # --- HELPER FUNCTION FOR SALE SERIALIZATION ---
# def serialize_sale(s, include_order_details=False):
#     """
#     Serializes a Sale object, optionally including associated Order and User details.
#     """
#     sale_data = {
#         'sale_id': s.sale_id,
#         'order_id': s.order_id,
#         'amount': str(s.amount), # Convert Float/Decimal to string for JSON compatibility
#         'sale_date': s.sale_date.isoformat() if s.sale_date else None,
#     }

#     if include_order_details:
#         order_obj = Order.query.get(s.order_id)
#         if order_obj:
#             sale_data['order_details'] = {
#                 'status': order_obj.status,
#                 'total_amount': str(order_obj.total_amount),
#                 'created_at': order_obj.created_at.isoformat() if order_obj.created_at else None,
#                 'updated_at': order_obj.updated_at.isoformat() if order_obj.updated_at else None,
#             }
#             user = User.query.get(order_obj.user_id)
#             if user:
#                 sale_data['user_details'] = {
#                     'id': user.id,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'email': user.email,
#                     'user_type': user.user_type
#                 }
#             else:
#                 sale_data['user_details'] = None # User not found
#         else:
#             sale_data['order_details'] = None # Order not found

#     return sale_data


# # --- USER/INTERNAL ROUTES (if applicable, though sales are usually admin-managed) ---

# # Create a sale (after an order is confirmed/paid) - this is typically handled by order status update
# @sale.route('/create', methods=['POST'])
# @jwt_required()
# def create_sale():
#     data = request.get_json()
#     order_id = data.get('order_id')
#     amount = data.get('amount')

#     if not order_id or not amount:
#         return jsonify({'error': 'order_id and amount are required'}), HTTP_400_BAD_REQUEST

#     # Check if order exists
#     order_obj = Order.query.get(order_id)
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     # Optional: check if sale for this order already exists to prevent duplicates
#     existing_sale = Sale.query.filter_by(order_id=order_id).first()
#     if existing_sale:
#         return jsonify({'error': 'Sale for this order already exists'}), HTTP_409_CONFLICT

#     new_sale = Sale(order_id=order_id, amount=amount)

#     try:
#         db.session.add(new_sale)
#         db.session.commit()
#         return jsonify({'message': 'Sale created', 'sale_id': new_sale.sale_id}), HTTP_201_CREATED
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error creating sale: {e}")
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get sale by sale_id (can be accessed by admin or potentially the user who placed the order)
# @sale.route('/<int:sale_id>', methods=['GET'])
# @jwt_required()
# def get_sale(sale_id):
#     sale_obj = Sale.query.get_or_404(sale_id)
#     return jsonify(serialize_sale(sale_obj, include_order_details=True)), HTTP_200_OK


# # Update sale (e.g. correct amount) - typically admin-only
# @sale.route('/<int:sale_id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_sale(sale_id):
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     sale_obj = Sale.query.get_or_404(sale_id)
#     data = request.get_json()

#     amount = data.get('amount')
#     if amount is not None:
#         sale_obj.amount = amount

#     try:
#         db.session.commit()
#         return jsonify({'message': 'Sale updated'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error updating sale: {e}")
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Delete sale - typically admin-only
# @sale.route('/<int:sale_id>', methods=['DELETE'])
# @jwt_required()
# def delete_sale(sale_id):
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     sale_obj = Sale.query.get_or_404(sale_id)
#     try:
#         db.session.delete(sale_obj)
#         db.session.commit()
#         return jsonify({'message': 'Sale deleted'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error deleting sale: {e}")
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Get all sales (admin/super_admin only) - MODIFIED FOR DASHBOARD
# # FIX: Use strict_slashes=False to prevent 308 redirect for /api/v1/sales vs /api/v1/sales/
# @sale.route('/', methods=['GET'], strict_slashes=False) # <--- CRITICAL CHANGE HERE!
# @jwt_required()
# def get_all_sales():
#     """
#     Admin/Superadmin only: Retrieves all sales in the system with pagination and optional search.
#     Search can be by Sale ID, Order ID, or User email/name.
#     """
#     if not is_admin_or_superadmin():
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)
#     search_query = request.args.get('search', '', type=str)

#     query = Sale.query

#     if search_query:
#         try:
#             # Try searching by Sale ID
#             search_id = int(search_query)
#             query = query.filter(Sale.sale_id == search_id)
#         except ValueError:
#             # If not a Sale ID, try searching by Order ID or User details
#             # This requires joining Sale -> Order -> User
#             query = query.join(Order, Sale.order_id == Order.order_id)
#             query = query.join(User, Order.user_id == User.id).filter(
#                 (User.email.ilike(f'%{search_query}%')) |
#                 (User.first_name.ilike(f'%{search_query}%')) |
#                 (User.last_name.ilike(f'%{search_query}%')) |
#                 (Order.order_id == search_query) # Allow searching by order_id as string too
#             )

#     # Order by sale_date descending for most recent sales first
#     paginated_sales = query.order_by(Sale.sale_date.desc()).paginate(page=page, per_page=per_page, error_out=False)

#     return jsonify({
#         'sales': [serialize_sale(s, include_order_details=True) for s in paginated_sales.items],
#         'total_sales': paginated_sales.total,
#         'pages': paginated_sales.pages,
#         'current_page': paginated_sales.page,
#         'per_page': paginated_sales.per_page
#     }), HTTP_200_OK











# # app/routes/sales.py
# from flask import Blueprint, request, jsonify
# from app.models.sale import Sale
# from app.models.order import Order # Needed to get order details
# from app.models.user import User # Needed to get user details for the order
# from app.extensions import db
# from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt # get_jwt for claims
# from datetime import datetime # Needed for isoformat()

# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_409_CONFLICT, HTTP_404_NOT_FOUND,
#     HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN
# )

# # Define the sales blueprint (keeping your name and url_prefix)
# sale = Blueprint('sale', __name__, url_prefix='/api/v1/sales')

# # Helper function for consistent admin/super_admin check
# def is_admin_or_superadmin():
#     """
#     Helper function to check if the current user has admin or super_admin role.
#     """
#     claims = get_jwt()
#     # Ensure 'user_type' is used as defined in auth.py, and 'super_admin' spelling is consistent
#     return claims.get('user_type') in ['admin', 'super_admin']

# # --- HELPER FUNCTION FOR SALE SERIALIZATION ---
# def serialize_sale(s, include_order_details=False):
#     """
#     Serializes a Sale object, optionally including associated Order and User details.
#     """
#     sale_data = {
#         'sale_id': s.sale_id,
#         'order_id': s.order_id,
#         'amount': str(s.amount), # Convert Float/Decimal to string for JSON compatibility
#         'sale_date': s.sale_date.isoformat() if s.sale_date else None,
#     }

#     if include_order_details:
#         order_obj = Order.query.get(s.order_id) # Renamed to avoid conflict with blueprint 'order'
#         if order_obj:
#             sale_data['order_details'] = {
#                 'status': order_obj.status,
#                 'total_amount': str(order_obj.total_amount),
#                 'created_at': order_obj.created_at.isoformat() if order_obj.created_at else None,
#                 'updated_at': order_obj.updated_at.isoformat() if order_obj.updated_at else None,
#             }
#             user = User.query.get(order_obj.user_id)
#             if user:
#                 sale_data['user_details'] = {
#                     'id': user.id,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'email': user.email,
#                     'user_type': user.user_type
#                 }
#             else:
#                 sale_data['user_details'] = None # User not found
#         else:
#             sale_data['order_details'] = None # Order not found

#     return sale_data


# # --- USER/INTERNAL ROUTES (if applicable, though sales are usually admin-managed) ---

# # Create a sale (after an order is confirmed/paid) - this is typically handled by order status update
# # Keeping it for now as per your original code, but it's less common for direct frontend use.
# @sale.route('/create', methods=['POST'])
# @jwt_required()
# def create_sale():
#     data = request.get_json()
#     order_id = data.get('order_id')
#     amount = data.get('amount')

#     if not order_id or not amount:
#         return jsonify({'error': 'order_id and amount are required'}), HTTP_400_BAD_REQUEST

#     # Check if order exists
#     order_obj = Order.query.get(order_id) # Renamed variable
#     if not order_obj:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     # Optional: check if sale for this order already exists to prevent duplicates
#     existing_sale = Sale.query.filter_by(order_id=order_id).first()
#     if existing_sale:
#         return jsonify({'error': 'Sale for this order already exists'}), HTTP_409_CONFLICT

#     new_sale = Sale(order_id=order_id, amount=amount) # Renamed variable

#     try:
#         db.session.add(new_sale)
#         db.session.commit()
#         return jsonify({'message': 'Sale created', 'sale_id': new_sale.sale_id}), HTTP_201_CREATED
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error creating sale: {e}")
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get sale by sale_id (can be accessed by admin or potentially the user who placed the order)
# @sale.route('/<int:sale_id>', methods=['GET'])
# @jwt_required()
# def get_sale(sale_id):
#     sale_obj = Sale.query.get_or_404(sale_id) # Renamed variable
#     # Optional: Add authorization check if only the user who made the order can view their sale
#     # user_id = get_jwt_identity()
#     # if sale_obj.order.user_id != int(user_id) and not is_admin_or_superadmin():
#     #     return jsonify({'error': 'Not authorized to view this sale'}), HTTP_403_FORBIDDEN

#     return jsonify(serialize_sale(sale_obj, include_order_details=True)), HTTP_200_OK


# # Update sale (e.g. correct amount) - typically admin-only
# @sale.route('/<int:sale_id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_sale(sale_id):
#     if not is_admin_or_superadmin(): # Add admin/super_admin check
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     sale_obj = Sale.query.get_or_404(sale_id) # Renamed variable
#     data = request.get_json()

#     amount = data.get('amount')
#     if amount is not None:
#         sale_obj.amount = amount

#     try:
#         db.session.commit()
#         return jsonify({'message': 'Sale updated'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error updating sale: {e}")
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Delete sale - typically admin-only
# @sale.route('/<int:sale_id>', methods=['DELETE'])
# @jwt_required()
# def delete_sale(sale_id):
#     if not is_admin_or_superadmin(): # Add admin/super_admin check
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     sale_obj = Sale.query.get_or_404(sale_id) # Renamed variable
#     try:
#         db.session.delete(sale_obj)
#         db.session.commit()
#         return jsonify({'message': 'Sale deleted'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error deleting sale: {e}")
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Get all sales (admin/super_admin only) - MODIFIED FOR DASHBOARD
# @sale.route('/', methods=['GET']) # Keeping your original route for get_all_sales
# @jwt_required()
# def get_all_sales():
#     """
#     Admin/Superadmin only: Retrieves all sales in the system with pagination and optional search.
#     Search can be by Sale ID, Order ID, or User email/name.
#     """
#     if not is_admin_or_superadmin(): # Use the consistent helper
#         return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)
#     search_query = request.args.get('search', '', type=str)

#     query = Sale.query

#     if search_query:
#         try:
#             # Try searching by Sale ID
#             search_id = int(search_query)
#             query = query.filter(Sale.sale_id == search_id)
#         except ValueError:
#             # If not a Sale ID, try searching by Order ID or User details
#             # This requires joining Sale -> Order -> User
#             query = query.join(Order, Sale.order_id == Order.order_id)
#             query = query.join(User, Order.user_id == User.id).filter(
#                 (User.email.ilike(f'%{search_query}%')) |
#                 (User.first_name.ilike(f'%{search_query}%')) |
#                 (User.last_name.ilike(f'%{search_query}%')) |
#                 (Order.order_id == search_query) # Allow searching by order_id as string too
#             )

#     # Order by sale_date descending for most recent sales first
#     paginated_sales = query.order_by(Sale.sale_date.desc()).paginate(page=page, per_page=per_page, error_out=False)

#     return jsonify({
#         'sales': [serialize_sale(s, include_order_details=True) for s in paginated_sales.items],
#         'total_sales': paginated_sales.total,
#         'pages': paginated_sales.pages,
#         'current_page': paginated_sales.page,
#         'per_page': paginated_sales.per_page
#     }), HTTP_200_OK




















# from flask import Blueprint, request, jsonify
# from app.models.sale import Sale
# from app.models.order import Order
# from app.extensions import db
# from app.models.user import User
# from flask_jwt_extended import get_jwt_identity
# from flask_jwt_extended import jwt_required

# from app.status_codes import HTTP_200_OK, HTTP_201_CREATED, HTTP_409_CONFLICT, HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

# sale = Blueprint('sale', __name__, url_prefix='/api/sales')

# # Create a sale (after an order is confirmed/paid)
# @sale.route('/create', methods=['POST'])
# @jwt_required()
# def create_sale():
#     data = request.get_json()
#     order_id = data.get('order_id')
#     amount = data.get('amount')

#     if not order_id or not amount:
#         return jsonify({'error': 'order_id and amount are required'}), HTTP_400_BAD_REQUEST

#     # Check if order exists
#     order = Order.query.get(order_id)
#     if not order:
#         return jsonify({'error': 'Order not found'}), HTTP_404_NOT_FOUND

#     # Optional: check if sale for this order already exists to prevent duplicates
#     existing_sale = Sale.query.filter_by(order_id=order_id).first()
#     if existing_sale:
#         return jsonify({'error': 'Sale for this order already exists'}), HTTP_409_CONFLICT

#     sale = Sale(order_id=order_id, amount=amount)

#     try:
#         db.session.add(sale)
#         db.session.commit()
#         return jsonify({'message': 'Sale created', 'sale_id': sale.sale_id}), HTTP_201_CREATED
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get sale by sale_id
# @sale.route('/<int:sale_id>', methods=['GET'])
# @jwt_required()
# def get_sale(sale_id):
#     sale = Sale.query.get_or_404(sale_id)
#     return jsonify({
#         'sale_id': sale.sale_id,
#         'order_id': sale.order_id,
#         'amount': sale.amount,
#         'sale_date': sale.sale_date.isoformat()
#     }), HTTP_200_OK


# # Update sale (e.g. correct amount)
# @sale.route('/<int:sale_id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_sale(sale_id):
#     sale = Sale.query.get_or_404(sale_id)
#     data = request.get_json()

#     amount = data.get('amount')
#     if amount is not None:
#         sale.amount = amount

#     try:
#         db.session.commit()
#         return jsonify({'message': 'Sale updated'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Delete sale
# @sale.route('/<int:sale_id>', methods=['DELETE'])
# @jwt_required()
# def delete_sale(sale_id):
#     sale = Sale.query.get_or_404(sale_id)
#     try:
#         db.session.delete(sale)
#         db.session.commit()
#         return jsonify({'message': 'Sale deleted'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Get all sales (admin only)
# @sale.route('/', methods=['GET'])
# @jwt_required()
# def get_all_sales():
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
#     if not user or user.user_type != 'admin':
#         return jsonify({'error': 'Admins only!'}), 403

#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)

#     pagination = Sale.query.order_by(Sale.sale_date.desc()).paginate(page=page, per_page=per_page, error_out=False)
#     sales = pagination.items

#     result = []
#     for sale in sales:
#         result.append({
#             'sale_id': sale.sale_id,
#             'order_id': sale.order_id,
#             'amount': sale.amount,
#             'sale_date': sale.sale_date.isoformat()
#         })

#     return jsonify({
#         'sales': result,
#         'total': pagination.total,
#         'page': pagination.page,
#         'pages': pagination.pages,
#         'per_page': pagination.per_page
#     }), 200
