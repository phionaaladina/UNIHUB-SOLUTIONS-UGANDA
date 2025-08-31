# from flask import Blueprint, request, jsonify
# from app.extensions import db
# from app.models.contactMessage import ContactMessage
# from datetime import datetime

# # Create Blueprint
# contact = Blueprint('contact', __name__, url_prefix='/api/v1/contact')

# @contact.route('/contact_message', methods=['POST'])
# def create_contact_message():
#     data = request.get_json()

#     if not data or not all(k in data for k in ('name', 'email', 'message')):
#         return jsonify({'error': 'Missing fields'}), 400

#     try:
#         new_message = ContactMessage(
#             name=data['name'],
#             email=data['email'],
#             message=data['message'],
#             date_sent=datetime.utcnow()
#         )
#         db.session.add(new_message)
#         db.session.commit()
#         return jsonify({'message': 'Message saved successfully'}), 200

#     except Exception as e:
#         print(e)
#         return jsonify({'error': 'Something went wrong'}), 500


# #GET ALL
# @contact.route('/', methods=['GET'])
# def get_all_contact_messages():
#     messages = ContactMessage.query.order_by(ContactMessage.date_sent.desc()).all()
#     result = [
#         {
#            'id': msg.contact_id,
#             'name': msg.name,
#             'email': msg.email,
#             'message': msg.message,
#             'date_sent': msg.date_sent.strftime('%Y-%m-%d %H:%M:%S')
#         }
#         for msg in messages
#     ]
#     return jsonify(result), 200

# #GET BY ID
# @contact.route('/contact_message/<int:id>', methods=['GET'])
# def get_contact_message(id):
#     msg = ContactMessage.query.get(id)
#     if not msg:
#         return jsonify({'error': 'Message not found'}), 404

#     return jsonify({
#         'id': msg.id,
#         'name': msg.name,
#         'email': msg.email,
#         'message': msg.message,
#         'date_sent': msg.date_sent.strftime('%Y-%m-%d %H:%M:%S')
#     }), 200


# #UPDATE
# @contact.route('/contact_message/<int:id>', methods=['PUT'])
# def update_contact_message(id):
#     msg = ContactMessage.query.get(id)
#     if not msg:
#         return jsonify({'error': 'Message not found'}), 404

#     data = request.get_json()
#     msg.name = data.get('name', msg.name)
#     msg.email = data.get('email', msg.email)
#     msg.message = data.get('message', msg.message)

#     db.session.commit()
#     return jsonify({'message': 'Message updated successfully'}), 200

# #DELETE

# @contact.route('/contact_message/<int:id>', methods=['DELETE'])
# def delete_contact_message(id):
#     msg = ContactMessage.query.get(id)
#     if not msg:
#         return jsonify({'error': 'Message not found'}), 404

#     db.session.delete(msg)
#     db.session.commit()
#     return jsonify({'message': 'Message deleted successfully'}), 200


# app/routes/contact.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.contactMessage import ContactMessage
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity # Import JWT functions
from app.models.user import User # Import User model to link replier (if used)
from app.status_codes import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN

# Create Blueprint
contact = Blueprint('contact', __name__, url_prefix='/api/v1/contact')

# Helper function for consistent admin/super_admin check
def is_admin_or_superadmin():
    """
    Helper function to check if the current user has admin or super_admin role.
    Assumes `get_jwt()` is available from Flask-JWT-Extended.
    """
    claims = get_jwt()
    return claims.get('user_type') in ['admin', 'super_admin']


# Helper function for serializing a single contact message
def serialize_contact_message(message):
    data = {
        'contact_id': message.contact_id,
        'name': message.name,
        'email': message.email,
        'message': message.message,
        'date_sent': message.date_sent.isoformat() if message.date_sent else None,
        'status': message.status,
        'replied_at': message.replied_at.isoformat() if message.replied_at else None,
        'replied_by_user_id': message.replied_by_user_id
    }
    # Optional: include replier's name if relationship is setup and User model is linked
    if message.replied_by_user_id and hasattr(message, 'replier') and message.replier:
        data['replied_by_user_name'] = f"{message.replier.first_name} {message.replier.last_name}"
    return data


# Route for submitting a contact message (publicly accessible)
@contact.route('/contact_message', methods=['POST'])
def create_contact_message():
    data = request.get_json()

    if not data or not all(k in data for k in ('name', 'email', 'message')):
        return jsonify({'error': 'Missing fields'}), HTTP_400_BAD_REQUEST

    try:
        new_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            message=data['message'],
            date_sent=datetime.utcnow(),
            status='pending' # Default status for new messages
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'message': 'Message saved successfully'}), HTTP_200_OK

    except Exception as e:
        db.session.rollback()
        print(f"Error creating contact message: {e}")
        return jsonify({'error': 'Something went wrong'}), HTTP_500_INTERNAL_SERVER_ERROR


# ADMIN/SUPERADMIN ROUTES
# Get all contact messages (Admin/Superadmin only, with pagination/search if desired)
@contact.route('/', methods=['GET'])
@jwt_required() # <--- Requires JWT token
def get_all_contact_messages():
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    # Add pagination and search capability for admin view
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search_query = request.args.get('search', '', type=str)
    status_filter = request.args.get('status', '', type=str) # New filter for status

    query = ContactMessage.query

    if status_filter:
        query = query.filter(ContactMessage.status == status_filter)

    if search_query:
        query = query.filter(
            (ContactMessage.name.ilike(f'%{search_query}%')) |
            (ContactMessage.email.ilike(f'%{search_query}%')) |
            (ContactMessage.message.ilike(f'%{search_query}%'))
        )

    # Order by date_sent descending for newest messages first
    paginated_messages = query.order_by(ContactMessage.date_sent.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'messages': [serialize_contact_message(msg) for msg in paginated_messages.items],
        'total_messages': paginated_messages.total,
        'pages': paginated_messages.pages,
        'current_page': paginated_messages.page,
        'per_page': paginated_messages.per_page
    }), HTTP_200_OK


# Get single contact message by ID (Admin/Superadmin only)
@contact.route('/<int:contact_id>', methods=['GET']) # Changed to contact_id for consistency
@jwt_required()
def get_contact_message(contact_id): # Changed parameter name
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    msg = ContactMessage.query.get(contact_id)
    if not msg:
        return jsonify({'error': 'Message not found'}), HTTP_404_NOT_FOUND

    return jsonify(serialize_contact_message(msg)), HTTP_200_OK


# Update contact message (Admin/Superadmin only - for status, etc.)
@contact.route('/<int:contact_id>', methods=['PUT', 'PATCH']) # Changed to contact_id for consistency
@jwt_required()
def update_contact_message(contact_id): # Changed parameter name
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    msg = ContactMessage.query.get(contact_id)
    if not msg:
        return jsonify({'error': 'Message not found'}), HTTP_404_NOT_FOUND

    data = request.get_json()

    # Allow updating status
    if 'status' in data:
        allowed_statuses = ['pending', 'replied', 'archived']
        if data['status'] not in allowed_statuses:
            return jsonify({'error': f"Invalid status. Allowed: {', '.join(allowed_statuses)}"}), HTTP_400_BAD_REQUEST
        msg.status = data['status']
        # If status is set to 'replied', record time and replier
        if msg.status == 'replied' and msg.replied_at is None:
            msg.replied_at = datetime.utcnow()
            msg.replied_by_user_id = get_jwt_identity() # Get the ID of the current admin user
        elif msg.status != 'replied': # If status is changed away from 'replied', clear reply info
            msg.replied_at = None
            msg.replied_by_user_id = None


    # You might not want admins to change name/email/message of submitted forms
    # msg.name = data.get('name', msg.name)
    # msg.email = data.get('email', msg.email)
    # msg.message = data.get('message', msg.message)

    try:
        db.session.commit()
        return jsonify({'message': 'Message updated successfully', 'message_details': serialize_contact_message(msg)}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error updating contact message: {e}")
        return jsonify({'error': 'Something went wrong'}), HTTP_500_INTERNAL_SERVER_ERROR


# Delete contact message (Admin/Superadmin only)
@contact.route('/<int:contact_id>', methods=['DELETE']) # Changed to contact_id for consistency
@jwt_required()
def delete_contact_message(contact_id): # Changed parameter name
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN

    msg = ContactMessage.query.get(contact_id)
    if not msg:
        return jsonify({'error': 'Message not found'}), HTTP_404_NOT_FOUND

    try:
        db.session.delete(msg)
        db.session.commit()
        return jsonify({'message': 'Message deleted successfully'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting contact message: {e}")
        return jsonify({'error': 'Something went wrong'}), HTTP_500_INTERNAL_SERVER_ERROR