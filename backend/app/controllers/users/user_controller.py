# # # app/controllers/users/user_controller.py
# # from flask import Blueprint, request, jsonify
# # from app.status_codes import HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED, HTTP_403_FORBIDDEN
# # import validators
# # from app.models.user import User
# # from app.extensions import db, bcrypt, mail # <--- Ensure bcrypt and mail are imported
# # from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
# # from werkzeug.security import generate_password_hash # This is only used for create_guest_user, consider using bcrypt consistently

# # import functools
# # import string
# # import random
# # from flask_mail import Message

# # # users blueprint
# # user = Blueprint('users', __name__, url_prefix='/api/v1/users')

# # # --- Helper for Admin Authorization ---
# # def admin_required(fn):
# #     @functools.wraps(fn)
# #     @jwt_required()
# #     def wrapper(*args, **kwargs):
# #         current_user_id = get_jwt_identity()
# #         user_obj = User.query.get(current_user_id)
# #         if user_obj and (user_obj.user_type == 'admin' or user_obj.user_type == 'super_admin'):
# #             return fn(*args, **kwargs)
# #         else:
# #             return jsonify({"msg": "Admin or Super Admin access required"}), HTTP_403_FORBIDDEN
# #     return wrapper

# # # --- Helper Functions for Password Generation and Email ---

# # def generate_random_password(length=12):
# #     """Generate a random password with letters, digits, and special characters."""
# #     characters = string.ascii_letters + string.digits + string.punctuation
# #     password = ''.join(random.choice(characters) for i in range(length))
# #     return password

# # def send_new_admin_email(email, username, password):
# #     """Sends an email to the new admin with their auto-generated password."""
# #     msg = Message(
# #         'Welcome to UniHub Admin Panel - Your New Account Details',
# #         recipients=[email]
# #     )
# #     msg.html = f"""
# #     <html>
# #     <head></head>
# #     <body>
# #         <p>Dear {username},</p>
# #         <p>Welcome to the UniHub Admin Panel!</p>
# #         <p>Your new administrator account has been created. Here are your login details:</p>
# #         <p><strong>Username/Email:</strong> {email}</p>
# #         <p><strong>Temporary Password:</strong> <code>{password}</code></p>
# #         <p>Please log in using these credentials and we highly recommend changing your password immediately for security reasons. You can do so in your profile settings after logging in.</p>
# #         <p>Login Page: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
# #         <p>If you have any issues, please contact support.</p>
# #         <p>Thank you,</p>
# #         <p>The UniHub Team</p>
# #     </body>
# #     </html>
# #     """
# #     try:
# #         mail.send(msg)
# #         print(f"Email sent successfully to {email}")
# #         return True
# #     except Exception as e:
# #         print(f"Failed to send email to {email}: {e}")
# #         return False

# # # --- Unified Create User Route (Handles all user types) ---
# # @user.route('/', methods=['POST'])
# # @jwt_required()
# # def create_user():
# #     data = request.get_json()
# #     first_name = data.get('first_name')
# #     last_name = data.get('last_name')
# #     email = data.get('email')
# #     contact = data.get('contact')
# #     user_type = data.get('user_type', 'user')
# #     password_from_request = data.get('password')

# #     if not all([first_name, last_name, email, contact]):
# #         return jsonify({'error': 'First Name, Last Name, Email, and Contact are required'}), HTTP_400_BAD_REQUEST

# #     if not validators.email(email):
# #         return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST

# #     if User.query.filter_by(email=email).first():
# #         return jsonify({'error': 'Email is already in use'}), HTTP_409_CONFLICT
# #     if User.query.filter_by(contact=contact).first():
# #         return jsonify({'error': 'Contact is already in use'}), HTTP_409_CONFLICT

# #     generated_password = None
# #     hashed_password = None
# #     password_was_generated = False

# #     if user_type in ['admin', 'super_admin']:
# #         current_user_id = get_jwt_identity()
# #         current_user = User.query.get(current_user_id)
# #         if not current_user or current_user.user_type != 'super_admin':
# #             return jsonify({'error': 'Access denied - only Super Admins can create Admin/Super Admin users.'}), HTTP_403_FORBIDDEN

# #         generated_password = generate_random_password()
# #         hashed_password = bcrypt.generate_password_hash(generated_password).decode('utf-8')
# #         password_was_generated = True
# #     else: # For 'user' type, expect password from request
# #         if not password_from_request:
# #             return jsonify({'error': 'Password is required for user accounts'}), HTTP_400_BAD_REQUEST
# #         if len(password_from_request) < 8:
# #             return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
# #         hashed_password = bcrypt.generate_password_hash(password_from_request).decode('utf-8')
# #         password_was_generated = False

# #     new_user = User(
# #         first_name=first_name,
# #         last_name=last_name,
# #         email=email,
# #         contact=contact,
# #         password=hashed_password, # <--- CHANGED: Use 'password' to match model
# #         user_type=user_type
# #     )

# #     try:
# #         db.session.add(new_user)
# #         db.session.commit()

# #         if password_was_generated:
# #             send_new_admin_email(email, new_user.get_full_name(), generated_password) # Use get_full_name()

# #         return jsonify({
# #             'message': f"User {new_user.get_full_name()} ({new_user.user_type}) created successfully.",
# #             'user': {
# #                 'id': new_user.id,
# #                 'email': new_user.email,
# #                 'name': new_user.get_full_name(),
# #                 'user_type': new_user.user_type
# #             },
# #             'password_generated': password_was_generated
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error creating user: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# # # Create a guest user
# # @user.route('/create_guest', methods=['POST'])
# # def create_guest_user():
# #     data = request.get_json()

# #     first_name = data.get('first_name', 'Guest')
# #     last_name = data.get('last_name', 'User')
# #     contact = data.get('contact', '0000000000')
# #     email = data.get('email', 'guest@example.com')
# #     password = data.get('password', 'guestpassword') # This password will be hashed

# #     # Using bcrypt for consistency with other password hashing
# #     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
# #     guest_id = 9999

# #     existing_guest = User.query.filter_by(id=guest_id).first()
# #     if existing_guest:
# #         return jsonify({"message": "Guest user already exists"}), HTTP_400_BAD_REQUEST

# #     guest_user = User(
# #         id=guest_id,
# #         first_name=first_name,
# #         last_name=last_name,
# #         contact=contact,
# #         email=email,
# #         password=hashed_password, # <--- CHANGED: Use 'password' to match model
# #         user_type='user'
# #     )

# #     try:
# #         db.session.add(guest_user)
# #         db.session.commit()
# #         return jsonify({"message": "Guest user created successfully", "user_id": guest_id}), HTTP_201_CREATED
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error creating guest user: {e}")
# #         return jsonify({"error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get all users (admin/super_admin only)
# # @user.route('/', methods=['GET'])
# # @admin_required
# # def get_all_users():
# #     try:
# #         page = int(request.args.get('page', 1))
# #         per_page = int(request.args.get('per_page', 10))
# #         search = request.args.get('search', '').strip()

# #         query = User.query

# #         if search:
# #             search_pattern = f"%{search}%"
# #             query = query.filter(
# #                 (User.first_name.ilike(search_pattern)) |
# #                 (User.last_name.ilike(search_pattern)) |
# #                 (User.email.ilike(search_pattern)) |
# #                 (User.contact.ilike(search_pattern))
# #             )

# #         paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

# #         result = [{
# #             'id': u.id,
# #             'first_name': u.first_name,
# #             'last_name': u.last_name,
# #             'email': u.email,
# #             'contact': u.contact,
# #             'user_type': u.user_type,
# #             'created_at': u.created_at.isoformat() if u.created_at else None
# #         } for u in paginated_users.items]

# #         return jsonify({
# #             'message': 'Users retrieved successfully',
# #             'total_users': paginated_users.total,
# #             'page': paginated_users.page,
# #             'pages': paginated_users.pages,
# #             'users': result
# #         }), HTTP_200_OK

# #     except Exception as e:
# #         print(f"Error in get_all_users: {e}")
# #         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get user by ID
# # @user.route('/<int:id>', methods=['GET'])
# # @jwt_required()
# # def get_user(id):
# #     user_item = User.query.get_or_404(id)
# #     return jsonify({
# #         'id': user_item.id,
# #         'first_name': user_item.first_name,
# #         'last_name': user_item.last_name,
# #         'email': user_item.email,
# #         'contact': user_item.contact,
# #         'user_type': user_item.user_type,
# #         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
# #     }), HTTP_200_OK


# # # Update user (self or admin)
# # @user.route('/<int:id>', methods=['PUT', 'PATCH'])
# # @jwt_required()
# # def update_user(id):
# #     current_user = User.query.get(get_jwt_identity())
# #     user_to_update = User.query.get_or_404(id)

# #     if current_user.id != user_to_update.id and current_user.user_type not in ['admin', 'super_admin']:
# #         return jsonify({'error': 'Not authorized to update this user'}), HTTP_403_FORBIDDEN

# #     if current_user.user_type == 'admin' and user_to_update.user_type in ['admin', 'super_admin'] and current_user.id != user_to_update.id:
# #         return jsonify({'error': 'Admin users cannot update other admins or super admins'}), HTTP_403_FORBIDDEN
    
# #     if current_user.user_type == 'super_admin' and 'user_type' in request.get_json():
# #         requested_user_type = request.get_json().get('user_type')
# #         if user_to_update.id == current_user.id and requested_user_type != 'super_admin':
# #             return jsonify({'error': 'Super Admin cannot demote themselves'}), HTTP_403_FORBIDDEN
# #         user_to_update.user_type = requested_user_type

# #     data = request.get_json()
# #     user_to_update.first_name = data.get('first_name', user_to_update.first_name)
# #     user_to_update.last_name = data.get('last_name', user_to_update.last_name)
# #     user_to_update.contact = data.get('contact', user_to_update.contact)

# #     if 'password' in data and data['password']:
# #         if len(data['password']) < 8:
# #             return jsonify({'error': 'New password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
# #         user_to_update.password = bcrypt.generate_password_hash(data['password']).decode('utf-8') # <--- CHANGED: Use 'password'

# #     try:
# #         db.session.commit()
# #         return jsonify({'message': 'User updated successfully'}), HTTP_200_OK
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error updating user {id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Delete user (admin/super_admin only)
# # @user.route('/<int:id>', methods=['DELETE'])
# # @admin_required
# # def delete_user(id):
# #     current_user = User.query.get(get_jwt_identity())
# #     user_to_delete = User.query.get_or_404(id)

# #     if current_user.id == user_to_delete.id:
# #         return jsonify({'error': 'Cannot delete your own account'}), HTTP_403_FORBIDDEN

# #     if current_user.user_type == 'admin' and user_to_delete.user_type in ['admin', 'super_admin']:
# #         return jsonify({'error': 'Admin users cannot delete other admins or super admins'}), HTTP_403_FORBIDDEN

# #     try:
# #         db.session.delete(user_to_delete)
# #         db.session.commit()
# #         return jsonify({'message': 'User deleted successfully'}), HTTP_200_OK
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error deleting user {id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get current logged-in user's profile
# # @user.route('/me', methods=['GET'])
# # @jwt_required()
# # def get_current_user():
# #     user_item = User.query.get_or_404(get_jwt_identity())
# #     return jsonify({
# #         'id': user_item.id,
# #         'first_name': user_item.first_name,
# #         'last_name': user_item.last_name,
# #         'email': user_item.email,
# #         'contact': user_item.contact,
# #         'user_type': user_item.user_type,
# #         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
# #     }), HTTP_200_OK


# # # Get users by role (e.g., user, admin, super_admin)
# # @user.route('/role/<string:role>', methods=['GET'])
# # @admin_required
# # def get_users_by_role(role):
# #     users = User.query.filter_by(user_type=role).all()
# #     result = [{
# #         'id': u.id,
# #         'first_name': u.first_name,
# #         'last_name': u.last_name,
# #         'email': u.email,
# #         'contact': u.contact,
# #         'user_type': u.user_type,
# #         'created_at': u.created_at.isoformat() if u.created_at else None
# #     } for u in users]

# #     return jsonify({
# #         'message': f'{role.capitalize()}s retrieved',
# #         'total': len(result),
# #         'users': result
# #     }), HTTP_200_OK

# #CORRECT UP ABOVE





# # # app/controllers/users/user_controller.py
# # from flask import Blueprint, request, jsonify
# # from app.status_codes import HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
# # import validators
# # from app.models.user import User
# # from app.extensions import db, bcrypt, mail # <--- Ensure bcrypt and mail are imported
# # from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
# # from werkzeug.security import generate_password_hash 

# # import functools
# # import string
# # import random
# # from flask_mail import Message

# # # users blueprint
# # user = Blueprint('users', __name__, url_prefix='/api/v1/users')

# # # --- Helper for Admin Authorization ---
# # def admin_required(fn):
# #     @functools.wraps(fn)
# #     @jwt_required()
# #     def wrapper(*args, **kwargs):
# #         current_user_id = get_jwt_identity()
# #         user_obj = db.session.get(User, current_user_id) # Use db.session.get for direct lookup
# #         if user_obj and (user_obj.user_type == 'admin' or user_obj.user_type == 'super_admin'):
# #             return fn(*args, **kwargs)
# #         else:
# #             return jsonify({"msg": "Admin or Super Admin access required"}), HTTP_403_FORBIDDEN
# #     return wrapper

# # # --- Helper Functions for Password Generation and Email ---

# # def generate_random_password(length=12):
# #     """Generate a random password with letters, digits, and special characters."""
# #     characters = string.ascii_letters + string.digits + string.punctuation
# #     password = ''.join(random.choice(characters) for i in range(length))
# #     return password

# # def send_new_admin_email(email, first_name, password):
# #     """Sends an email to the new admin with their auto-generated password using Flask-Mail."""
# #     try:
# #         msg = Message(
# #             subject="Welcome to UniHub Admin Panel - Your New Account Details",
# #             sender="your_email@example.com", # Replace with your configured MAIL_USERNAME
# #             recipients=[email],
# #             body=f"""Hello {first_name},

# # You have been successfully added as an admin on the UniHub website.

# # Login using your registered email and the password shared with you below:

# # Email: {email}
# # Temporary Password: {password}

# # Please keep this information secure and consider changing your password after your first login.

# # Login Page: http://localhost:3000/login

# # Best regards,
# # The UniHub Team"""
# #         )
# #         mail.send(msg)
# #         print(f"Email sent successfully to {email}")
# #         return True
# #     except Exception as e:
# #         print(f"Failed to send email to {email}: {e}")
# #         return False

# # # --- Unified Create User Route (Handles all user types) ---
# # @user.route('/', methods=['POST'])
# # @jwt_required()
# # def create_user():
# #     data = request.get_json()
# #     first_name = data.get('first_name')
# #     last_name = data.get('last_name')
# #     email = data.get('email')
# #     contact = data.get('contact')
# #     user_type = data.get('user_type', 'user')
# #     password_from_request = data.get('password')

# #     if not all([first_name, last_name, email, contact]):
# #         return jsonify({'error': 'First Name, Last Name, Email, and Contact are required'}), HTTP_400_BAD_REQUEST

# #     if not validators.email(email):
# #         return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST

# #     if User.query.filter_by(email=email).first():
# #         return jsonify({'error': 'Email is already in use'}), HTTP_409_CONFLICT
# #     if User.query.filter_by(contact=contact).first():
# #         return jsonify({'error': 'Contact is already in use'}), HTTP_409_CONFLICT

# #     generated_password = None
# #     hashed_password = None
# #     password_was_generated = False

# #     if user_type in ['admin', 'super_admin']:
# #         current_user_id = get_jwt_identity()
# #         current_user = db.session.get(User, current_user_id) # Use db.session.get
# #         if not current_user or current_user.user_type != 'super_admin':
# #             return jsonify({'error': 'Access denied - only Super Admins can create Admin/Super Admin users.'}), HTTP_403_FORBIDDEN

# #         generated_password = generate_random_password()
# #         hashed_password = bcrypt.generate_password_hash(generated_password).decode('utf-8')
# #         password_was_generated = True
# #     else: # For 'user' type, expect password from request
# #         if not password_from_request:
# #             return jsonify({'error': 'Password is required for user accounts'}), HTTP_400_BAD_REQUEST
# #         if len(password_from_request) < 8:
# #             return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
# #         hashed_password = bcrypt.generate_password_hash(password_from_request).decode('utf-8')
# #         password_was_generated = False

# #     new_user = User(
# #         first_name=first_name,
# #         last_name=last_name,
# #         email=email,
# #         contact=contact,
# #         password=hashed_password, 
# #         user_type=user_type
# #     )

# #     try:
# #         db.session.add(new_user)
# #         db.session.commit()

# #         if password_was_generated:
# #             # Pass first_name and generated_password to the email function
# #             send_new_admin_email(new_user.email, new_user.first_name, generated_password) 

# #         return jsonify({
# #             'message': f"User {new_user.get_full_name()} ({new_user.user_type}) created successfully.",
# #             'user': {
# #                 'id': new_user.id,
# #                 'email': new_user.email,
# #                 'name': new_user.get_full_name(),
# #                 'user_type': new_user.user_type
# #             },
# #             'password_generated': password_was_generated
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error creating user: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# # # Create a guest user
# # @user.route('/create_guest', methods=['POST'])
# # def create_guest_user():
# #     data = request.get_json()

# #     first_name = data.get('first_name', 'Guest')
# #     last_name = data.get('last_name', 'User')
# #     contact = data.get('contact', '0000000000')
# #     email = data.get('email', 'guest@example.com')
# #     password = data.get('password', 'guestpassword') 

# #     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
# #     guest_id = 9999

# #     existing_guest = db.session.get(User, guest_id) # Use db.session.get
# #     if existing_guest:
# #         return jsonify({"message": "Guest user already exists"}), HTTP_400_BAD_REQUEST

# #     guest_user = User(
# #         id=guest_id,
# #         first_name=first_name,
# #         last_name=last_name,
# #         contact=contact,
# #         email=email,
# #         password=hashed_password, 
# #         user_type='user'
# #     )

# #     try:
# #         db.session.add(guest_user)
# #         db.session.commit()
# #         return jsonify({"message": "Guest user created successfully", "user_id": guest_id}), HTTP_201_CREATED
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error creating guest user: {e}")
# #         return jsonify({"error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get all users (admin/super_admin only)
# # @user.route('/', methods=['GET'])
# # @admin_required
# # def get_all_users():
# #     try:
# #         page = int(request.args.get('page', 1))
# #         per_page = int(request.args.get('per_page', 10))
# #         search = request.args.get('search', '').strip()

# #         query = User.query

# #         if search:
# #             search_pattern = f"%{search}%"
# #             query = query.filter(
# #                 (User.first_name.ilike(search_pattern)) |
# #                 (User.last_name.ilike(search_pattern)) |
# #                 (User.email.ilike(search_pattern)) |
# #                 (User.contact.ilike(search_pattern))
# #             )

# #         paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

# #         result = [{
# #             'id': u.id,
# #             'first_name': u.first_name,
# #             'last_name': u.last_name,
# #             'email': u.email,
# #             'contact': u.contact,
# #             'user_type': u.user_type,
# #             'created_at': u.created_at.isoformat() if u.created_at else None
# #         } for u in paginated_users.items]

# #         return jsonify({
# #             'message': 'Users retrieved successfully',
# #             'total_users': paginated_users.total,
# #             'page': paginated_users.page,
# #             'pages': paginated_users.pages,
# #             'users': result
# #         }), HTTP_200_OK

# #     except Exception as e:
# #         print(f"Error in get_all_users: {e}")
# #         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get user by ID
# # @user.route('/<int:id>', methods=['GET'])
# # @jwt_required()
# # def get_user(id):
# #     user_item = db.session.get(User, id) # Use db.session.get_or_404 if you want Flask to handle 404, otherwise handle it explicitly
# #     if not user_item:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

# #     return jsonify({
# #         'id': user_item.id,
# #         'first_name': user_item.first_name,
# #         'last_name': user_item.last_name,
# #         'email': user_item.email,
# #         'contact': user_item.contact,
# #         'user_type': user_item.user_type,
# #         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
# #     }), HTTP_200_OK


# # # Update user (self or admin)
# # @user.route('/<int:id>', methods=['PUT', 'PATCH'])
# # @jwt_required()
# # def update_user(id):
# #     current_user_id = get_jwt_identity()
# #     current_user = db.session.get(User, current_user_id)
# #     user_to_update = db.session.get(User, id)

# #     if not user_to_update:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

# #     if current_user.id != user_to_update.id and current_user.user_type not in ['admin', 'super_admin']:
# #         return jsonify({'error': 'Not authorized to update this user'}), HTTP_403_FORBIDDEN

# #     if current_user.user_type == 'admin' and user_to_update.user_type in ['admin', 'super_admin'] and current_user.id != user_to_update.id:
# #         return jsonify({'error': 'Admin users cannot update other admins or super admins'}), HTTP_403_FORBIDDEN
    
# #     data = request.get_json()

# #     # Super admin can update user_type, with a self-demotion check
# #     if current_user.user_type == 'super_admin' and 'user_type' in data:
# #         requested_user_type = data.get('user_type')
# #         if user_to_update.id == current_user.id and requested_user_type != 'super_admin':
# #             return jsonify({'error': 'Super Admin cannot demote themselves'}), HTTP_403_FORBIDDEN
# #         user_to_update.user_type = requested_user_type

# #     user_to_update.first_name = data.get('first_name', user_to_update.first_name)
# #     user_to_update.last_name = data.get('last_name', user_to_update.last_name)
    
# #     # Email and Contact update with conflict checks
# #     new_email = data.get('email', user_to_update.email)
# #     new_contact = data.get('contact', user_to_update.contact)

# #     if new_email != user_to_update.email and User.query.filter(User.email == new_email, User.id != user_to_update.id).first():
# #         return jsonify({"error": "Email already in use"}), HTTP_409_CONFLICT
# #     if new_contact != user_to_update.contact and User.query.filter(User.contact == new_contact, User.id != user_to_update.id).first():
# #         return jsonify({"error": "Contact already in use"}), HTTP_409_CONFLICT

# #     user_to_update.email = new_email
# #     user_to_update.contact = new_contact

# #     if 'password' in data and data['password']:
# #         if len(data['password']) < 8:
# #             return jsonify({'error': 'New password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
# #         user_to_update.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

# #     try:
# #         db.session.commit()
# #         return jsonify({'message': 'User updated successfully'}), HTTP_200_OK
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error updating user {id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Delete user (admin/super_admin only)
# # @user.route('/<int:id>', methods=['DELETE'])
# # @admin_required
# # def delete_user(id):
# #     current_user_id = get_jwt_identity()
# #     current_user = db.session.get(User, current_user_id)
# #     user_to_delete = db.session.get(User, id)

# #     if not user_to_delete:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

# #     if current_user.id == user_to_delete.id:
# #         return jsonify({'error': 'Cannot delete your own account'}), HTTP_403_FORBIDDEN

# #     if current_user.user_type == 'admin' and user_to_delete.user_type in ['admin', 'super_admin']:
# #         return jsonify({'error': 'Admin users cannot delete other admins or super admins'}), HTTP_403_FORBIDDEN

# #     try:
# #         db.session.delete(user_to_delete)
# #         db.session.commit()
        
# #         # Optionally send a notification email for deletion
# #         # msg = Message(
# #         #     subject="Your UniHub Account Has Been Deleted",
# #         #     sender="your_email@example.com", # Replace with your configured MAIL_USERNAME
# #         #     recipients=[user_to_delete.email],
# #         #     body=f"""Hello {user_to_delete.first_name},
# #         #     Your account on UniHub has been deleted.
# #         #     If you believe this was in error, please contact support.
# #         #     Best regards,
# #         #     The UniHub Team"""
# #         # )
# #         # mail.send(msg)

# #         return jsonify({'message': 'User deleted successfully'}), HTTP_200_OK
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error deleting user {id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get current logged-in user's profile
# # @user.route('/me', methods=['GET'])
# # @jwt_required()
# # def get_current_user():
# #     user_item = db.session.get(User, get_jwt_identity())
# #     if not user_item:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND # Should not happen if JWT is valid

# #     return jsonify({
# #         'id': user_item.id,
# #         'first_name': user_item.first_name,
# #         'last_name': user_item.last_name,
# #         'email': user_item.email,
# #         'contact': user_item.contact,
# #         'user_type': user_item.user_type,
# #         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
# #     }), HTTP_200_OK


# # # Get users by role (e.g., user, admin, super_admin)
# # @user.route('/role/<string:role>', methods=['GET'])
# # @admin_required
# # def get_users_by_role(role):
# #     users = User.query.filter_by(user_type=role).all()
# #     result = [{
# #         'id': u.id,
# #         'first_name': u.first_name,
# #         'last_name': u.last_name,
# #         'email': u.email,
# #         'contact': u.contact,
# #         'user_type': u.user_type,
# #         'created_at': u.created_at.isoformat() if u.created_at else None
# #     } for u in users]

# #     return jsonify({
# #         'message': f'{role.capitalize()}s retrieved',
# #         'total': len(result),
# #         'users': result
# #     }), HTTP_200_OK



# # # app/controllers/users/user_controller.py
# # from flask import Blueprint, request, jsonify
# # from app.status_codes import HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
# # import validators
# # from app.models.user import User
# # from app.extensions import db, bcrypt, mail # <--- Ensure bcrypt and mail are imported
# # from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
# # from werkzeug.security import generate_password_hash 

# # import functools
# # import string
# # import random
# # from flask_mail import Message

# # # users blueprint
# # user = Blueprint('users', __name__, url_prefix='/api/v1/users')

# # # --- Helper for Admin Authorization ---
# # def admin_required(fn):
# #     @functools.wraps(fn)
# #     @jwt_required()
# #     def wrapper(*args, **kwargs):
# #         current_user_id = get_jwt_identity()
# #         user_obj = db.session.get(User, current_user_id) # Use db.session.get for direct lookup
# #         if user_obj and (user_obj.user_type == 'admin' or user_obj.user_type == 'super_admin'):
# #             return fn(*args, **kwargs)
# #         else:
# #             return jsonify({"msg": "Admin or Super Admin access required"}), HTTP_403_FORBIDDEN
# #     return wrapper

# # # --- Helper for Super Admin Authorization ---
# # def super_admin_required(fn):
# #     @functools.wraps(fn)
# #     @jwt_required()
# #     def wrapper(*args, **kwargs):
# #         current_user_id = get_jwt_identity()
# #         user_obj = db.session.get(User, current_user_id)
# #         if user_obj and user_obj.user_type == 'super_admin':
# #             return fn(*args, **kwargs)
# #         else:
# #             return jsonify({"msg": "Super Admin access required"}), HTTP_403_FORBIDDEN
# #     return wrapper

# # # --- Helper Functions for Password Generation and Email ---

# # def generate_random_password(length=12):
# #     """Generate a random password with letters, digits, and special characters."""
# #     characters = string.ascii_letters + string.digits + string.punctuation
# #     password = ''.join(random.choice(characters) for i in range(length))
# #     return password

# # def send_user_notification_email(email, subject, body_content):
# #     """Sends a generic email notification to a user using Flask-Mail."""
# #     try:
# #         msg = Message(
# #             subject=subject,
# #             sender="your_email@example.com", # Replace with your configured MAIL_USERNAME
# #             recipients=[email],
# #             body=body_content
# #         )
# #         mail.send(msg)
# #         print(f"Email '{subject}' sent successfully to {email}")
# #         return True
# #     except Exception as e:
# #         print(f"Failed to send email to {email}: {e}")
# #         return False

# # # --- Unified Create User Route (Handles all user types) ---
# # @user.route('/', methods=['POST'])
# # @jwt_required() # Assuming even regular user creation requires an authenticated user (e.g., an admin creating users)
# # def create_user():
# #     data = request.get_json()
# #     first_name = data.get('first_name')
# #     last_name = data.get('last_name')
# #     email = data.get('email')
# #     contact = data.get('contact')
# #     user_type = data.get('user_type', 'user') # Default to 'user' if not specified
# #     password_from_request = data.get('password')

# #     if not all([first_name, last_name, email, contact]):
# #         return jsonify({'error': 'First Name, Last Name, Email, and Contact are required'}), HTTP_400_BAD_REQUEST

# #     if not validators.email(email):
# #         return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST

# #     if User.query.filter_by(email=email).first():
# #         return jsonify({'error': 'Email is already in use'}), HTTP_409_CONFLICT
# #     if User.query.filter_by(contact=contact).first():
# #         return jsonify({'error': 'Contact is already in use'}), HTTP_409_CONFLICT

# #     generated_password = None
# #     hashed_password = None
# #     password_was_generated = False

# #     # Authorization check for creating admin/super_admin users
# #     if user_type in ['admin', 'super_admin']:
# #         current_user_id = get_jwt_identity()
# #         current_user = db.session.get(User, current_user_id)
# #         if not current_user or current_user.user_type != 'super_admin':
# #             return jsonify({'error': 'Access denied - only Super Admins can create Admin/Super Admin users.'}), HTTP_403_FORBIDDEN

# #         generated_password = generate_random_password()
# #         hashed_password = bcrypt.generate_password_hash(generated_password).decode('utf-8')
# #         password_was_generated = True
# #     else: # For 'user' type, expect password from request
# #         if not password_from_request:
# #             return jsonify({'error': 'Password is required for user accounts'}), HTTP_400_BAD_REQUEST
# #         if len(password_from_request) < 8:
# #             return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
# #         hashed_password = bcrypt.generate_password_hash(password_from_request).decode('utf-8')
# #         password_was_generated = False

# #     new_user = User(
# #         first_name=first_name,
# #         last_name=last_name,
# #         email=email,
# #         contact=contact,
# #         password=hashed_password, 
# #         user_type=user_type
# #     )

# #     try:
# #         db.session.add(new_user)
# #         db.session.commit()

# #         if password_was_generated:
# #             email_subject = f"Welcome to UniHub Admin Panel - Your New Account Details"
# #             email_body = f"""Hello {new_user.first_name},

# # You have been successfully added as an {new_user.user_type} on the UniHub website.

# # Login using your registered email and the password shared with you below:

# # Email: {new_user.email}
# # Temporary Password: {generated_password}

# # Please keep this information secure and consider changing your password after your first login.

# # Login Page: http://localhost:3000/login

# # Best regards,
# # The UniHub Team"""
# #             send_user_notification_email(new_user.email, email_subject, email_body)

# #         return jsonify({
# #             'message': f"User {new_user.get_full_name()} ({new_user.user_type}) created successfully.",
# #             'user': {
# #                 'id': new_user.id,
# #                 'email': new_user.email,
# #                 'name': new_user.get_full_name(),
# #                 'user_type': new_user.user_type
# #             },
# #             'password_generated': password_was_generated
# #         }), HTTP_201_CREATED

# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error creating user: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# # # Create a guest user
# # @user.route('/create_guest', methods=['POST'])
# # def create_guest_user():
# #     data = request.get_json()

# #     first_name = data.get('first_name', 'Guest')
# #     last_name = data.get('last_name', 'User')
# #     contact = data.get('contact', '0000000000') # Consider a way to make this unique or less generic
# #     email = data.get('email', 'guest@example.com') # Consider a way to make this unique or less generic
# #     password = data.get('password', 'guestpassword') 

# #     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
# #     guest_id = 9999 # This fixed ID can cause issues if you have many guest users

# #     # Check if a user with guest_id or generic guest email/contact already exists
# #     existing_guest = db.session.get(User, guest_id)
# #     if existing_guest:
# #         return jsonify({"message": "Guest user with this ID already exists"}), HTTP_400_BAD_REQUEST
    
# #     # You might want to allow multiple guest users but manage them differently.
# #     # For now, let's assume a single "guest" account that can be reused or managed.
# #     # If you intend to allow multiple temporary "guest" accounts, you'd need a different strategy
# #     # for IDs and uniqueness.
# #     if User.query.filter_by(email=email).first() or User.query.filter_by(contact=contact).first():
# #         return jsonify({"error": "A user with the default guest email or contact already exists. Please use unique details if creating multiple guest-like accounts."}), HTTP_409_CONFLICT


# #     guest_user = User(
# #         id=guest_id, # This is dangerous for multiple guest users. Better to let DB generate ID.
# #         first_name=first_name,
# #         last_name=last_name,
# #         contact=contact,
# #         email=email,
# #         password=hashed_password, 
# #         user_type='user'
# #     )

# #     try:
# #         db.session.add(guest_user)
# #         db.session.commit()
# #         return jsonify({"message": "Guest user created successfully", "user_id": guest_id}), HTTP_201_CREATED
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error creating guest user: {e}")
# #         return jsonify({"error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get all users (admin/super_admin only)
# # @user.route('/', methods=['GET'])
# # @admin_required
# # def get_all_users():
# #     try:
# #         page = int(request.args.get('page', 1))
# #         per_page = int(request.args.get('per_page', 10))
# #         search = request.args.get('search', '').strip()
# #         user_type_filter = request.args.get('user_type', '').strip().lower() # New filter for user_type

# #         query = User.query

# #         if search:
# #             search_pattern = f"%{search}%"
# #             query = query.filter(
# #                 (User.first_name.ilike(search_pattern)) |
# #                 (User.last_name.ilike(search_pattern)) |
# #                 (User.email.ilike(search_pattern)) |
# #                 (User.contact.ilike(search_pattern))
# #             )
        
# #         if user_type_filter:
# #             # Validate user_type_filter to prevent arbitrary filtering
# #             valid_user_types = ['user', 'admin', 'super_admin']
# #             if user_type_filter not in valid_user_types:
# #                 return jsonify({'error': 'Invalid user_type filter specified. Must be one of: user, admin, super_admin.'}), HTTP_400_BAD_REQUEST
# #             query = query.filter_by(user_type=user_type_filter)


# #         paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

# #         result = [{
# #             'id': u.id,
# #             'first_name': u.first_name,
# #             'last_name': u.last_name,
# #             'email': u.email,
# #             'contact': u.contact,
# #             'user_type': u.user_type,
# #             'created_at': u.created_at.isoformat() if u.created_at else None
# #         } for u in paginated_users.items]

# #         return jsonify({
# #             'message': 'Users retrieved successfully',
# #             'total_users': paginated_users.total,
# #             'page': paginated_users.page,
# #             'pages': paginated_users.pages,
# #             'users': result
# #         }), HTTP_200_OK

# #     except Exception as e:
# #         print(f"Error in get_all_users: {e}")
# #         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get user by ID
# # @user.route('/<int:id>', methods=['GET'])
# # @jwt_required()
# # def get_user(id):
# #     user_item = db.session.get(User, id) 
# #     if not user_item:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

# #     current_user_id = get_jwt_identity()
# #     current_user = db.session.get(User, current_user_id)

# #     # Authorization: User can see their own profile, Admins/Super Admins can see any profile
# #     if current_user.id != user_item.id and current_user.user_type not in ['admin', 'super_admin']:
# #         return jsonify({'error': 'Not authorized to view this user\'s profile'}), HTTP_403_FORBIDDEN

# #     return jsonify({
# #         'id': user_item.id,
# #         'first_name': user_item.first_name,
# #         'last_name': user_item.last_name,
# #         'email': user_item.email,
# #         'contact': user_item.contact,
# #         'user_type': user_item.user_type,
# #         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
# #     }), HTTP_200_OK


# # # Update user (self or admin, and super_admin for user_type)
# # @user.route('/<int:id>', methods=['PUT', 'PATCH'])
# # @jwt_required()
# # def update_user(id):
# #     current_user_id = get_jwt_identity()
# #     current_user = db.session.get(User, current_user_id)
# #     user_to_update = db.session.get(User, id)

# #     if not user_to_update:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

# #     data = request.get_json()
    
# #     # --- Authorization for updating user_type ---
# #     if 'user_type' in data:
# #         requested_user_type = data.get('user_type')

# #         # Validate requested_user_type
# #         valid_user_types = ['user', 'admin', 'super_admin']
# #         if requested_user_type not in valid_user_types:
# #             return jsonify({'error': 'Invalid user_type specified.'}), HTTP_400_BAD_REQUEST

# #         # Only Super Admin can change user_type
# #         if current_user.user_type != 'super_admin':
# #             return jsonify({'error': 'Only Super Admins can change user types.'}), HTTP_403_FORBIDDEN

# #         # Super Admin cannot demote themselves from 'super_admin'
# #         if user_to_update.id == current_user.id and requested_user_type != 'super_admin':
# #             return jsonify({'error': 'Super Admin cannot demote themselves.'}), HTTP_403_FORBIDDEN

# #         # Super Admin cannot demote another Super Admin to 'admin' or 'user' via this general update
# #         # This requires a dedicated, explicit action for security.
# #         if user_to_update.user_type == 'super_admin' and requested_user_type != 'super_admin' and user_to_update.id != current_user.id:
# #             return jsonify({'error': 'Cannot demote another Super Admin via this endpoint. Use a specific Super Admin demotion endpoint if necessary.'}), HTTP_403_FORBIDDEN
        
# #         # If all checks pass, allow Super Admin to change user_type
# #         user_to_update.user_type = requested_user_type

# #         # Send email notification about role change if applicable
# #         if user_to_update.user_type != user_to_update.user_type: # Check if actual change occurred
# #              if requested_user_type == 'admin':
# #                 email_subject = "Your UniHub Role Has Been Updated: Admin Privileges Granted"
# #                 email_body = f"""Hello {user_to_update.first_name},

# # You have been granted admin privileges on UniHub by a Super Admin.
# # You can now access administrative features.

# # Best regards,
# # The UniHub Team"""
# #              elif requested_user_type == 'user':
# #                 email_subject = "Your UniHub Role Has Been Updated: Admin Privileges Revoked"
# #                 email_body = f"""Hello {user_to_update.first_name},

# # Your admin privileges on UniHub have been revoked by a Super Admin.
# # You will no longer have access to administrative features.

# # Best regards,
# # The UniHub Team"""
# #              else: # For other user types or generic role changes
# #                  email_subject = "Your UniHub Account Role Has Been Updated"
# #                  email_body = f"""Hello {user_to_update.first_name},

# # Your account role on UniHub has been updated to '{requested_user_type}'.

# # Best regards,
# # The UniHub Team"""
# #              send_user_notification_email(user_to_update.email, email_subject, email_body)
    
# #     # --- Authorization for general profile updates (non-user_type fields) ---
# #     # A user can update their own profile. Admins/Super Admins can update any non-admin/non-super_admin user.
# #     if current_user.id != user_to_update.id: # If not updating self
# #         if current_user.user_type not in ['admin', 'super_admin']:
# #             return jsonify({'error': 'Not authorized to update this user'}), HTTP_403_FORBIDDEN
# #         # Admin cannot update other admins or super admins
# #         if current_user.user_type == 'admin' and user_to_update.user_type in ['admin', 'super_admin']:
# #             return jsonify({'error': 'Admin users cannot update other admins or super admins'}), HTTP_403_FORBIDDEN
# #         # Super admin can update anyone, but we've handled user_type separately above.
# #         # For other fields, super admin has full control.

# #     # Update general user fields
# #     user_to_update.first_name = data.get('first_name', user_to_update.first_name)
# #     user_to_update.last_name = data.get('last_name', user_to_update.last_name)
    
# #     new_email = data.get('email', user_to_update.email)
# #     new_contact = data.get('contact', user_to_update.contact)

# #     if new_email != user_to_update.email and User.query.filter(User.email == new_email, User.id != user_to_update.id).first():
# #         return jsonify({"error": "Email already in use"}), HTTP_409_CONFLICT
# #     if new_contact != user_to_update.contact and User.query.filter(User.contact == new_contact, User.id != user_to_update.id).first():
# #         return jsonify({"error": "Contact already in use"}), HTTP_409_CONFLICT

# #     user_to_update.email = new_email
# #     user_to_update.contact = new_contact

# #     if 'password' in data and data['password']:
# #         if len(data['password']) < 8:
# #             return jsonify({'error': 'New password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
# #         user_to_update.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

# #     try:
# #         db.session.commit()
# #         return jsonify({'message': 'User updated successfully'}), HTTP_200_OK
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error updating user {id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Delete user (admin/super_admin only)
# # @user.route('/<int:id>', methods=['DELETE'])
# # @admin_required # Only admins/super admins can delete users
# # def delete_user(id):
# #     current_user_id = get_jwt_identity()
# #     current_user = db.session.get(User, current_user_id)
# #     user_to_delete = db.session.get(User, id)

# #     if not user_to_delete:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

# #     # Prevent a user from deleting themselves
# #     if current_user.id == user_to_delete.id:
# #         return jsonify({'error': 'Cannot delete your own account'}), HTTP_403_FORBIDDEN

# #     # Prevent admin from deleting other admins or super admins
# #     if current_user.user_type == 'admin' and user_to_delete.user_type in ['admin', 'super_admin']:
# #         return jsonify({'error': 'Admin users cannot delete other admins or super admins'}), HTTP_403_FORBIDDEN
    
# #     # Super Admin cannot delete another Super Admin. Requires explicit multi-step process for such critical action.
# #     if current_user.user_type == 'super_admin' and user_to_delete.user_type == 'super_admin' and current_user.id != user_to_delete.id:
# #          return jsonify({'error': 'Super Admin cannot directly delete another Super Admin\'s account.'}), HTTP_403_FORBIDDEN


# #     try:
# #         db.session.delete(user_to_delete)
# #         db.session.commit()
        
# #         # Optionally send a notification email for deletion
# #         email_subject = "Your UniHub Account Has Been Deleted"
# #         email_body = f"""Hello {user_to_delete.first_name},
# # Your account on UniHub has been deleted.
# # If you believe this was in error, please contact support.
# # Best regards,
# # The UniHub Team"""
# #         send_user_notification_email(user_to_delete.email, email_subject, email_body)

# #         return jsonify({'message': 'User deleted successfully'}), HTTP_200_OK
# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error deleting user {id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # # Get current logged-in user's profile
# # @user.route('/me', methods=['GET'])
# # @jwt_required()
# # def get_current_user():
# #     user_item = db.session.get(User, get_jwt_identity())
# #     if not user_item:
# #         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND # Should not happen if JWT is valid

# #     return jsonify({
# #         'id': user_item.id,
# #         'first_name': user_item.first_name,
# #         'last_name': user_item.last_name,
# #         'email': user_item.email,
# #         'contact': user_item.contact,
# #         'user_type': user_item.user_type,
# #         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
# #     }), HTTP_200_OK


# # # Get users by role (e.g., user, admin, super_admin)
# # @user.route('/role/<string:role>', methods=['GET'])
# # @admin_required # Only admins/super admins can get users by role
# # def get_users_by_role(role):
# #     valid_roles = ['user', 'admin', 'super_admin']
# #     if role not in valid_roles:
# #         return jsonify({'error': 'Invalid role specified. Must be one of: user, admin, super_admin.'}), HTTP_400_BAD_REQUEST

# #     users = User.query.filter_by(user_type=role).all()
# #     result = [{
# #         'id': u.id,
# #         'first_name': u.first_name,
# #         'last_name': u.last_name,
# #         'email': u.email,
# #         'contact': u.contact,
# #         'user_type': u.user_type,
# #         'created_at': u.created_at.isoformat() if u.created_at else None
# #     } for u in users]

# #     return jsonify({
# #         'message': f'{role.capitalize()}s retrieved',
# #         'total': len(result),
# #         'users': result
# #     }), HTTP_200_OK

# # # --- NEW ENDPOINT: Demote Super Admin to Admin (Very specific, explicit action) ---
# # @user.route('/demote_super_admin/<int:super_admin_id>', methods=['PUT'])
# # @super_admin_required # Only another super admin can perform this
# # def demote_super_admin(super_admin_id):
# #     """
# #     Allows a Super Admin to demote another Super Admin to an 'admin' role.
# #     This is a highly sensitive action and requires explicit intent.
# #     Cannot demote a Super Admin to a regular 'user' directly via this route.
# #     """
# #     current_user_id = get_jwt_identity()
# #     current_super_admin = db.session.get(User, current_user_id)
# #     super_admin_to_demote = db.session.get(User, super_admin_id)

# #     if not super_admin_to_demote:
# #         return jsonify({'error': 'Super Admin to demote not found.'}), HTTP_404_NOT_FOUND

# #     if super_admin_to_demote.user_type != 'super_admin':
# #         return jsonify({'error': 'User is not a Super Admin.'}), HTTP_400_BAD_REQUEST

# #     if super_admin_to_demote.id == current_super_admin.id:
# #         return jsonify({'error': 'Super Admin cannot demote themselves using this endpoint.'}), HTTP_403_FORBIDDEN

# #     try:
# #         super_admin_to_demote.user_type = 'admin' # Demote to regular 'admin'
# #         db.session.commit()

# #         email_subject = "Your UniHub Super Admin Privileges Have Been Modified"
# #         email_body = f"""Hello {super_admin_to_demote.first_name},

# # Your account on UniHub has been demoted from 'Super Admin' to 'Admin' by another Super Admin.
# # You will still have access to many administrative features, but some super admin exclusive functionalities will be restricted.

# # If you believe this was in error, please contact support immediately.

# # Best regards,
# # The UniHub Team"""
# #         send_user_notification_email(super_admin_to_demote.email, email_subject, email_body)

# #         return jsonify({
# #             'message': f"Super Admin {super_admin_to_demote.get_full_name()} has been demoted to 'admin'.",
# #             'user_id': super_admin_to_demote.id,
# #             'new_user_type': super_admin_to_demote.user_type
# #         }), HTTP_200_OK

# #     except Exception as e:
# #         db.session.rollback()
# #         print(f"Error demoting super admin {super_admin_id}: {e}")
# #         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR




# #working up




# # app/controllers/users/user_controller.py
# from flask import Blueprint, request, jsonify, current_app # Added current_app
# from app.status_codes import HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
# import validators
# from app.models.user import User
# from app.extensions import db, bcrypt, mail # <--- Ensure bcrypt and mail are imported
# from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt # get_jwt for current user role
# # from werkzeug.security import generate_password_hash # Removed as bcrypt is used consistently

# import functools
# import string
# import random
# from flask_mail import Message
# import logging # Import logging

# # Get a logger for this module
# logger = logging.getLogger(__name__)

# # users blueprint
# user = Blueprint('users', __name__, url_prefix='/api/v1/users')

# # --- Helper for Admin Authorization ---
# def admin_required(fn):
#     @functools.wraps(fn)
#     @jwt_required()
#     def wrapper(*args, **kwargs):
#         current_user_id = get_jwt_identity()
#         user_obj = db.session.get(User, current_user_id) # Use db.session.get for direct lookup
#         if user_obj and (user_obj.user_type == 'admin' or user_obj.user_type == 'super_admin'):
#             return fn(*args, **kwargs)
#         else:
#             return jsonify({"msg": "Admin or Super Admin access required"}), HTTP_403_FORBIDDEN
#     return wrapper

# # --- Helper for Super Admin Authorization ---
# def super_admin_required(fn):
#     @functools.wraps(fn)
#     @jwt_required()
#     def wrapper(*args, **kwargs):
#         current_user_id = get_jwt_identity()
#         user_obj = db.session.get(User, current_user_id)
#         if user_obj and user_obj.user_type == 'super_admin':
#             return fn(*args, **kwargs)
#         else:
#             return jsonify({"msg": "Super Admin access required"}), HTTP_403_FORBIDDEN
#     return wrapper

# # --- Helper Functions for Password Generation and Email ---

# def generate_random_password(length=12):
#     """Generate a random password with letters, digits, and special characters."""
#     characters = string.ascii_letters + string.digits + string.punctuation
#     password = ''.join(random.choice(characters) for i in range(length))
#     return password

# def send_user_notification_email(email, subject, body_content):
#     """Sends a generic email notification to a user using Flask-Mail."""
#     try:
#         msg = Message(
#             subject=subject,
#             sender=current_app.config.get('MAIL_USERNAME', 'your_email@example.com'), # Use config, with fallback
#             recipients=[email],
#             html=body_content # Use html for rich text email body
#         )
#         with current_app.app_context(): # Ensure we are in app context for mail.send
#             mail.send(msg)
#         logger.info(f"Email '{subject}' sent successfully to {email}")
#         return True
#     except Exception as e:
#         logger.error(f"Failed to send email to {email}: {e}", exc_info=True) # Log full exception info
#         return False

# # --- Unified Create User Route (Handles all user types) ---
# @user.route('/', methods=['POST'])
# @jwt_required() # Assuming even regular user creation requires an authenticated user (e.g., an admin creating users)
# def create_user():
#     data = request.get_json()
#     first_name = data.get('first_name')
#     last_name = data.get('last_name')
#     email = data.get('email')
#     contact = data.get('contact')
#     user_type = data.get('user_type', 'user') # Default to 'user' if not specified
#     password_from_request = data.get('password')

#     if not all([first_name, last_name, email, contact]):
#         return jsonify({'error': 'First Name, Last Name, Email, and Contact are required'}), HTTP_400_BAD_REQUEST

#     if not validators.email(email):
#         return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST

#     if User.query.filter_by(email=email).first():
#         return jsonify({'error': 'Email is already in use'}), HTTP_409_CONFLICT
#     if User.query.filter_by(contact=contact).first():
#         return jsonify({'error': 'Contact is already in use'}), HTTP_409_CONFLICT

#     generated_password = None
#     hashed_password = None
#     password_was_generated = False

#     # Authorization check for creating admin/super_admin users
#     if user_type in ['admin', 'super_admin']:
#         current_user_id = get_jwt_identity()
#         current_user = db.session.get(User, current_user_id) # Use db.session.get
#         if not current_user or current_user.user_type != 'super_admin':
#             return jsonify({'error': 'Access denied - only Super Admins can create Admin/Super Admin users.'}), HTTP_403_FORBIDDEN

#         generated_password = generate_random_password()
#         hashed_password = bcrypt.generate_password_hash(generated_password).decode('utf-8')
#         password_was_generated = True
#     else: # For 'user' type, expect password from request
#         if not password_from_request:
#             return jsonify({'error': 'Password is required for user accounts'}), HTTP_400_BAD_REQUEST
#         if len(password_from_request) < 8:
#             return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
#         hashed_password = bcrypt.generate_password_hash(password_from_request).decode('utf-8')
#         password_was_generated = False

#     new_user = User(
#         first_name=first_name,
#         last_name=last_name,
#         email=email,
#         contact=contact,
#         password=hashed_password, 
#         user_type=user_type
#     )

#     try:
#         db.session.add(new_user)
#         db.session.commit()

#         if password_was_generated:
#             email_subject = f"Welcome to UniHub - Your New Account Details"
#             email_body = f"""
#             <html>
#             <head></head>
#             <body>
#                 <p>Hello {new_user.first_name},</p>
#                 <p>You have been successfully added as an <strong>{new_user.user_type}</strong> on the UniHub website.</p>
#                 <p>Login using your registered email and the password shared with you below:</p>
#                 <p><strong>Email:</strong> {new_user.email}</p>
#                 <p><strong>Temporary Password:</strong> <code>{generated_password}</code></p>
#                 <p>Please keep this information secure and consider changing your password after your first login.</p>
#                 <p>Login Page: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
#                 <p>Best regards,<br>The UniHub Team</p>
#             </body>
#             </html>
#             """
#             send_user_notification_email(new_user.email, email_subject, email_body)

#         return jsonify({
#             'message': f"User {new_user.get_full_name()} ({new_user.user_type}) created successfully.",
#             'user': {
#                 'id': new_user.id,
#                 'email': new_user.email,
#                 'name': new_user.get_full_name(),
#                 'user_type': new_user.user_type
#             },
#             'password_generated': password_was_generated
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error creating user: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# # Create a guest user
# @user.route('/create_guest', methods=['POST'])
# def create_guest_user():
#     data = request.get_json()

#     first_name = data.get('first_name', 'Guest')
#     last_name = data.get('last_name', 'User')
#     # It's highly recommended to make email and contact unique for each guest if you plan to create many.
#     # For now, keeping the defaults but be aware of potential conflicts if not unique.
#     # You might consider generating unique values for email/contact for each guest user.
#     contact = data.get('contact', '0000000000') 
#     email = data.get('email', 'guest@example.com') 
#     password = data.get('password', 'guestpassword') 

#     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
#     # --- REMOVED: guest_id = 9999 and existing_guest check ---
#     # The database will now automatically generate a unique ID for each new user.
    
#     # Check if a user with the provided email or contact already exists
#     # This check is still important to prevent duplicate unique fields
#     if User.query.filter_by(email=email).first():
#         return jsonify({"error": "A user with this email already exists."}), HTTP_409_CONFLICT
#     if User.query.filter_by(contact=contact).first():
#         return jsonify({"error": "A user with this contact already exists."}), HTTP_409_CONFLICT


#     guest_user = User(
#         # REMOVED: id=guest_id, - Let the database generate the ID
#         first_name=first_name,
#         last_name=last_name,
#         contact=contact,
#         email=email,
#         password=hashed_password, 
#         user_type='user' # Guest users are typically 'user' type
#     )

#     try:
#         db.session.add(guest_user)
#         db.session.commit()
#         # Return the actual ID generated by the database
#         return jsonify({"message": "Guest user created successfully", "user_id": guest_user.id}), HTTP_201_CREATED
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error creating guest user: {e}", exc_info=True)
#         return jsonify({"error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR



# # Get all users (admin/super_admin only)
# @user.route('/', methods=['GET'])
# @admin_required
# def get_all_users():
#     try:
#         page = int(request.args.get('page', 1))
#         per_page = int(request.args.get('per_page', 10))
#         search = request.args.get('search', '').strip()
#         user_type_filter = request.args.get('user_type', '').strip().lower() # New filter for user_type

#         query = User.query

#         if search:
#             search_pattern = f"%{search}%"
#             query = query.filter(
#                 (User.first_name.ilike(search_pattern)) |
#                 (User.last_name.ilike(search_pattern)) |
#                 (User.email.ilike(search_pattern)) |
#                 (User.contact.ilike(search_pattern))
#             )
        
#         if user_type_filter:
#             valid_user_types = ['user', 'admin', 'super_admin']
#             if user_type_filter not in valid_user_types:
#                 return jsonify({'error': 'Invalid user_type filter specified. Must be one of: user, admin, super_admin.'}), HTTP_400_BAD_REQUEST
#             query = query.filter_by(user_type=user_type_filter)


#         paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

#         result = [{
#             'id': u.id,
#             'first_name': u.first_name,
#             'last_name': u.last_name,
#             'email': u.email,
#             'contact': u.contact,
#             'user_type': u.user_type,
#             'created_at': u.created_at.isoformat() if u.created_at else None
#         } for u in paginated_users.items]

#         return jsonify({
#             'message': 'Users retrieved successfully',
#             'total_users': paginated_users.total,
#             'page': paginated_users.page,
#             'pages': paginated_users.pages,
#             'users': result
#         }), HTTP_200_OK

#     except Exception as e:
#         logger.error(f"Error in get_all_users: {e}", exc_info=True)
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get user by ID
# @user.route('/<int:id>', methods=['GET'])
# @jwt_required()
# def get_user(id):
#     user_item = db.session.get(User, id) 
#     if not user_item:
#         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

#     current_user_id = get_jwt_identity()
#     current_user = db.session.get(User, current_user_id)

#     if current_user.id != user_item.id and current_user.user_type not in ['admin', 'super_admin']:
#         return jsonify({'error': 'Not authorized to view this user\'s profile'}), HTTP_403_FORBIDDEN

#     return jsonify({
#         'id': user_item.id,
#         'first_name': user_item.first_name,
#         'last_name': user_item.last_name,
#         'email': user_item.email,
#         'contact': user_item.contact,
#         'user_type': user_item.user_type,
#         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
#     }), HTTP_200_OK


# # Update user (self or admin, and super_admin for user_type)
# @user.route('/<int:id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_user(id):
#     current_user_id = get_jwt_identity()
#     current_user = db.session.get(User, current_user_id)
#     user_to_update = db.session.get(User, id)

#     if not user_to_update:
#         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

#     data = request.get_json()
    
#     # Store the old user type before any potential update
#     old_user_type = user_to_update.user_type

#     # --- Authorization for updating user_type ---
#     if 'user_type' in data:
#         requested_user_type = data.get('user_type')

#         valid_user_types = ['user', 'admin', 'super_admin']
#         if requested_user_type not in valid_user_types:
#             return jsonify({'error': 'Invalid user_type specified.'}), HTTP_400_BAD_REQUEST

#         if current_user.user_type != 'super_admin':
#             return jsonify({'error': 'Only Super Admins can change user types.'}), HTTP_403_FORBIDDEN

#         if user_to_update.id == current_user.id and requested_user_type != 'super_admin':
#             return jsonify({'error': 'Super Admin cannot demote themselves.'}), HTTP_403_FORBIDDEN

#         # This endpoint is not for demoting one Super Admin to Admin.
#         # That should be handled by a specific endpoint if needed.
#         if user_to_update.user_type == 'super_admin' and requested_user_type != 'super_admin' and user_to_update.id != current_user.id:
#             return jsonify({'error': 'Cannot demote another Super Admin via this endpoint.'}), HTTP_403_FORBIDDEN
        
#         # If all checks pass, allow Super Admin to change user_type
#         if requested_user_type != old_user_type: # Only proceed if role actually changes
#             user_to_update.user_type = requested_user_type

#             # --- Send email notification about role change ---
#             email_subject = ""
#             email_body = ""

#             # Case 1: Promoting a 'user' to 'admin'
#             if old_user_type == 'user' and requested_user_type == 'admin':
#                 email_subject = "Congratulations! Your UniHub Role Has Been Updated to Admin"
#                 email_body = f"""
#                 <html>
#                 <head></head>
#                 <body>
#                     <p>Hello {user_to_update.first_name},</p>
#                     <p>Congratulations!</p>
#                     <p>Your account on UniHub has been promoted from a <strong>{old_user_type.capitalize()}</strong> to an <strong>{requested_user_type.capitalize()}</strong>.</p>
#                     <p>As an Admin, you now have access to administrative features and responsibilities within UniHub.</p>
#                     <p>Please log in to explore your new capabilities and manage content/users as required.</p>
#                     <p>If you have any questions, please contact support.</p>
#                     <p>Best regards,<br>The UniHub Team</p>
#                 </body>
#                 </html>
#                 """
            
#             # Case 2: Demoting an 'admin' to 'user'
#             elif old_user_type == 'admin' and requested_user_type == 'user':
#                 email_subject = "Important: Your UniHub Admin Rights Have Been Revoked"
#                 email_body = f"""
#                 <html>
#                 <head></head>
#                 <body>
#                     <p>Hello {user_to_update.first_name},</p>
#                     <p>This is to inform you that your account role on UniHub has been updated.</p>
#                     <p>Your previous role was <strong>{old_user_type.capitalize()}</strong>, and your new role is <strong>{requested_user_type.capitalize()}</strong>.</p>
#                     <p>Your administrative privileges have been revoked, and your account is now a standard user account.</p>
#                     <p>You can still log in and use UniHub as a regular user.</p>
#                     <p>If you believe this was in error or have any questions, please contact support.</p>
#                     <p>Best regards,<br>The UniHub Team</p>
#                 </body>
#                 </html>
#                 """

#             # Case 3: Promoting 'user' or 'admin' to 'super_admin' (if allowed by your overall flow)
#             elif requested_user_type == 'super_admin' and old_user_type != 'super_admin':
#                 email_subject = "Congratulations! Your UniHub Role Has Been Updated to Super Admin"
#                 email_body = f"""
#                 <html>
#                 <head></head>
#                 <body>
#                     <p>Hello {user_to_update.first_name},</p>
#                     <p>Congratulations! Your account on UniHub has been promoted from a <strong>{old_user_type.capitalize()}</strong> to a <strong>{requested_user_type.capitalize()}</strong>.</p>
#                     <p>As a Super Admin, you now have the highest level of access and responsibility within UniHub. Please log in to manage all aspects of the platform.</p>
#                     <p>If you have any questions, please contact support.</p>
#                     <p>Best regards,<br>The UniHub Team</p>
#                 </body>
#                 </html>
#                 """

#             if email_subject and email_body: # Only send if content was prepared
#                 try:
#                     send_user_notification_email(user_to_update.email, email_subject, email_body)
#                     logger.info(f"Role change email sent for user {user_to_update.id}: from {old_user_type} to {requested_user_type}")
#                 except Exception as e:
#                     logger.error(f"Failed to send role change email to {user_to_update.email}: {e}", exc_info=True)
#             else:
#                 logger.info(f"No specific email content prepared for role change from {old_user_type} to {requested_user_type}.")
#         else:
#             logger.info(f"User {user_to_update.id} role was attempted to be set to {requested_user_type} but was already that type. No email sent.")

#     # --- Authorization for general profile updates (non-user_type fields) ---
#     if current_user.id != user_to_update.id:
#         if current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Not authorized to update this user'}), HTTP_403_FORBIDDEN
#         if current_user.user_type == 'admin' and user_to_update.user_type in ['admin', 'super_admin']:
#             return jsonify({'error': 'Admin users cannot update other admins or super admins'}), HTTP_403_FORBIDDEN

#     # Update general user fields
#     user_to_update.first_name = data.get('first_name', user_to_update.first_name)
#     user_to_update.last_name = data.get('last_name', user_to_update.last_name)
    
#     new_email = data.get('email', user_to_update.email)
#     new_contact = data.get('contact', user_to_update.contact)

#     if new_email != user_to_update.email and User.query.filter(User.email == new_email, User.id != user_to_update.id).first():
#         return jsonify({"error": "Email already in use"}), HTTP_409_CONFLICT
#     if new_contact != user_to_update.contact and User.query.filter(User.contact == new_contact, User.id != user_to_update.id).first():
#         return jsonify({"error": "Contact already in use"}), HTTP_409_CONFLICT

#     user_to_update.email = new_email
#     user_to_update.contact = new_contact

#     if 'password' in data and data['password']:
#         if len(data['password']) < 8:
#             return jsonify({'error': 'New password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
#         user_to_update.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

#     try:
#         db.session.commit()
#         return jsonify({'message': 'User updated successfully'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error updating user {id}: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # Delete user (admin/super_admin only)
# @user.route('/<int:id>', methods=['DELETE'])
# @admin_required # Only admins/super admins can delete users
# def delete_user(id):
#     current_user_id = get_jwt_identity()
#     current_user = db.session.get(User, current_user_id)
#     user_to_delete = db.session.get(User, id)

#     if not user_to_delete:
#         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

#     if current_user.id == user_to_delete.id:
#         return jsonify({'error': 'Cannot delete your own account'}), HTTP_403_FORBIDDEN

#     if current_user.user_type == 'admin' and user_to_delete.user_type in ['admin', 'super_admin']:
#         return jsonify({'error': 'Admin users cannot delete other admins or super admins'}), HTTP_403_FORBIDDEN
    
#     if current_user.user_type == 'super_admin' and user_to_delete.user_type == 'super_admin' and current_user.id != user_to_delete.id:
#         return jsonify({'error': 'Super Admin cannot directly delete another Super Admin\'s account.'}), HTTP_403_FORBIDDEN


#     try:
#         db.session.delete(user_to_delete)
#         db.session.commit()
        
#         email_subject = "Your UniHub Account Has Been Deleted"
#         email_body = f"""
#         <html>
#         <head></head>
#         <body>
#             <p>Hello {user_to_delete.first_name},</p>
#             <p>Your account on UniHub has been deleted.</p>
#             <p>If you believe this was in error, please contact support.</p>
#             <p>Best regards,<br>The UniHub Team</p>
#         </body>
#         </html>
#         """
#         send_user_notification_email(user_to_delete.email, email_subject, email_body)

#         return jsonify({'message': 'User deleted successfully'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error deleting user {id}: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get current logged-in user's profile
# @user.route('/me', methods=['GET'])
# @jwt_required()
# def get_current_user():
#     user_item = db.session.get(User, get_jwt_identity())
#     if not user_item:
#         return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND # Should not happen if JWT is valid

#     return jsonify({
#         'id': user_item.id,
#         'first_name': user_item.first_name,
#         'last_name': user_item.last_name,
#         'email': user_item.email,
#         'contact': user_item.contact,
#         'user_type': user_item.user_type,
#         'created_at': user_item.created_at.isoformat() if user_item.created_at else None
#     }), HTTP_200_OK


# # Get users by role (e.g., user, admin, super_admin)
# @user.route('/role/<string:role>', methods=['GET'])
# @admin_required # Only admins/super admins can get users by role
# def get_users_by_role(role):
#     valid_roles = ['user', 'admin', 'super_admin']
#     if role not in valid_roles:
#         return jsonify({'error': 'Invalid role specified. Must be one of: user, admin, super_400_BAD_REQUEST_admin.'}), HTTP_400_BAD_REQUEST

#     users = User.query.filter_by(user_type=role).all()
#     result = [{
#         'id': u.id,
#         'first_name': u.first_name,
#         'last_name': u.last_name,
#         'email': u.email,
#         'contact': u.contact,
#         'user_type': u.user_type,
#         'created_at': u.created_at.isoformat() if u.created_at else None
#     } for u in users]

#     return jsonify({
#         'message': f'{role.capitalize()}s retrieved',
#         'total': len(result),
#         'users': result
#     }), HTTP_200_OK

# # --- NEW ENDPOINT: Demote Super Admin to Admin (Very specific, explicit action) ---
# @user.route('/demote_super_admin/<int:super_admin_id>', methods=['PUT'])
# @super_admin_required # Only another super admin can perform this
# def demote_super_admin(super_admin_id):
#     """
#     Allows a Super Admin to demote another Super Admin to an 'admin' role.
#     This is a highly sensitive action and requires explicit intent.
#     Cannot demote a Super Admin to a regular 'user' directly via this route.
#     """
#     current_user_id = get_jwt_identity()
#     current_super_admin = db.session.get(User, current_user_id)
#     super_admin_to_demote = db.session.get(User, super_admin_id)

#     if not super_admin_to_demote:
#         return jsonify({'error': 'Super Admin to demote not found.'}), HTTP_404_NOT_FOUND

#     if super_admin_to_demote.user_type != 'super_admin':
#         return jsonify({'error': 'User is not a Super Admin.'}), HTTP_400_BAD_REQUEST

#     if super_admin_to_demote.id == current_super_admin.id:
#         return jsonify({'error': 'Super Admin cannot demote themselves using this endpoint.'}), HTTP_403_FORBIDDEN

#     try:
#         super_admin_to_demote.user_type = 'admin' # Demote to regular 'admin'
#         db.session.commit()

#         email_subject = "Your UniHub Super Admin Privileges Have Been Modified"
#         email_body = f"""
#         <html>
#         <head></head>
#         <body>
#             <p>Hello {super_admin_to_demote.first_name},</p>
#             <p>Your account on UniHub has been demoted from 'Super Admin' to 'Admin' by another Super Admin.</p>
#             <p>You will still have access to many administrative features, but some super admin exclusive functionalities will be restricted.</p>
#             <p>If you believe this was in error, please contact support immediately.</p>
#             <p>Best regards,<br>The UniHub Team</p>
#         </body>
#         </html>
#         """
#         send_user_notification_email(super_admin_to_demote.email, email_subject, email_body)

#         return jsonify({
#             'message': f"Super Admin {super_admin_to_demote.get_full_name()} has been demoted to 'admin'.",
#             'user_id': super_admin_to_demote.id,
#             'new_user_type': super_admin_to_demote.user_type
#         }), HTTP_200_OK

#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error demoting super admin {super_admin_id}: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR







# # --- TEMPORARY ROUTE TO DELETE GUEST USER BY HARDCODED ID ---
# # !!! WARNING: REMOVE THIS ROUTE AFTER USE !!!
# @user.route('/delete_guest_by_id/<int:guest_id_to_delete>', methods=['DELETE'])
# @super_admin_required # Only a super admin should be able to trigger this
# def delete_specific_guest_user(guest_id_to_delete):
#     if guest_id_to_delete != 9999: # Ensure only the specific guest ID can be targeted
#         return jsonify({"error": "This endpoint is only for deleting the default guest user (ID 9999)."}), HTTP_403_FORBIDDEN

#     user_to_delete = db.session.get(User, guest_id_to_delete)

#     if not user_to_delete:
#         return jsonify({'error': 'Guest user with ID 9999 not found'}), HTTP_404_NOT_FOUND

#     # Optional: Add an extra check if you want to ensure it's a 'user' type guest
#     # if user_to_delete.user_type != 'user':
#     #     return jsonify({'error': 'User with ID 9999 is not a guest user (user_type is not "user").'}), HTTP_403_FORBIDDEN

#     try:
#         db.session.delete(user_to_delete)
#         db.session.commit()
#         logger.info(f"Successfully deleted guest user with ID: {guest_id_to_delete}")
#         # No email notification for this specific cleanup deletion
#         return jsonify({'message': f'Guest user with ID {guest_id_to_delete} deleted successfully'}), HTTP_200_OK
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error deleting guest user {guest_id_to_delete}: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred during deletion.'}), HTTP_500_INTERNAL_SERVER_ERROR




# app/controllers/users/user_controller.py
from flask import Blueprint, request, jsonify
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED, HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND
)
import validators
from app.models.user import User
from app.extensions import db, bcrypt, mail
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt

import functools
import string
import random
from flask_mail import Message

# users blueprint
user = Blueprint('users', __name__, url_prefix='/api/v1/users')

# --- Helper for Admin Authorization ---
def admin_required(fn):
    @functools.wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user_obj = db.session.get(User, current_user_id)
        if user_obj and (user_obj.user_type == 'admin' or user_obj.user_type == 'super_admin'):
            return fn(*args, **kwargs)
        else:
            return jsonify({"msg": "Admin or Super Admin access required"}), HTTP_403_FORBIDDEN
    return wrapper

# --- Helper for Super Admin Authorization ---
def super_admin_required(fn):
    @functools.wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user_obj = db.session.get(User, current_user_id)
        if user_obj and user_obj.user_type == 'super_admin':
            return fn(*args, **kwargs)
        else:
            return jsonify({"msg": "Super Admin access required"}), HTTP_403_FORBIDDEN
    return wrapper

# --- Helper Functions for Password Generation and Email ---
def generate_random_password(length=12):
    """Generate a random password with letters, digits, and special characters."""
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password

def send_user_notification_email(email, subject, body):
    """Sends a general email notification."""
    try:
        msg = Message(
            subject=subject,
            sender="your_email@example.com",  # Replace with your configured MAIL_USERNAME
            recipients=[email],
            body=body
        )
        mail.send(msg)
        print(f"Email sent successfully to {email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")
        return False

# --- Unified Create User Route (Handles all user types) ---
@user.route('/', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    contact = data.get('contact')
    user_type = data.get('user_type', 'user')
    password_from_request = data.get('password')

    if not all([first_name, last_name, email, contact]):
        return jsonify({'error': 'First Name, Last Name, Email, and Contact are required'}), HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email is already in use'}), HTTP_409_CONFLICT
    if User.query.filter_by(contact=contact).first():
        return jsonify({'error': 'Contact is already in use'}), HTTP_409_CONFLICT

    generated_password = None
    hashed_password = None
    password_was_generated = False

    if user_type in ['admin', 'super_admin']:
        current_user_id = get_jwt_identity()
        current_user = db.session.get(User, current_user_id)
        if not current_user or current_user.user_type != 'super_admin':
            return jsonify({'error': 'Access denied - only Super Admins can create Admin/Super Admin users.'}), HTTP_403_FORBIDDEN

        generated_password = generate_random_password()
        hashed_password = bcrypt.generate_password_hash(generated_password).decode('utf-8')
        password_was_generated = True
    else:  # For 'user' type, expect password from request
        if not password_from_request:
            return jsonify({'error': 'Password is required for user accounts'}), HTTP_400_BAD_REQUEST
        if len(password_from_request) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
        hashed_password = bcrypt.generate_password_hash(password_from_request).decode('utf-8')
        password_was_generated = False

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        contact=contact,
        password=hashed_password,
        user_type=user_type
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        if password_was_generated:
            body = f"""Hello {first_name},

You have been successfully added as an admin on the UniHub website.

Login using your registered email and the password shared with you below:

Email: {email}
Temporary Password: {generated_password}

Please keep this information secure and consider changing your password after your first login.

Login Page: http://localhost:3000/login

Best regards,
The UniHub Team"""
            send_user_notification_email(new_user.email, "Welcome to UniHub Admin Panel - Your New Account Details", body)

        return jsonify({
            'message': f"User {new_user.first_name} ({new_user.user_type}) created successfully.",
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name,
                'user_type': new_user.user_type
            },
            'password_generated': password_was_generated
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# --- Get all users (admin/super_admin only) ---
@user.route('/', methods=['GET'])
@admin_required
def get_all_users():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '').strip()

        query = User.query

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (User.first_name.ilike(search_pattern)) |
                (User.last_name.ilike(search_pattern)) |
                (User.email.ilike(search_pattern)) |
                (User.contact.ilike(search_pattern))
            )

        paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

        result = [{
            'id': u.id,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'email': u.email,
            'contact': u.contact,
            'user_type': u.user_type,
            'created_at': u.created_at.isoformat() if u.created_at else None
        } for u in paginated_users.items]

        return jsonify({
            'message': 'Users retrieved successfully',
            'total_users': paginated_users.total,
            'page': paginated_users.page,
            'pages': paginated_users.pages,
            'users': result
        }), HTTP_200_OK

    except Exception as e:
        print(f"Error in get_all_users: {e}")
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# --- Get user by ID ---
@user.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user_item = db.session.get(User, id)
    if not user_item:
        return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

    return jsonify({
        'id': user_item.id,
        'first_name': user_item.first_name,
        'last_name': user_item.last_name,
        'email': user_item.email,
        'contact': user_item.contact,
        'user_type': user_item.user_type,
        'created_at': user_item.created_at.isoformat() if user_item.created_at else None
    }), HTTP_200_OK

# --- Update user (self or admin) ---
@user.route('/<int:id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_user(id):
    current_user_id = get_jwt_identity()
    current_user = db.session.get(User, current_user_id)
    user_to_update = db.session.get(User, id)

    if not user_to_update:
        return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

    if current_user.id != user_to_update.id and current_user.user_type not in ['admin', 'super_admin']:
        return jsonify({'error': 'Not authorized to update this user'}), HTTP_403_FORBIDDEN

    if current_user.user_type == 'admin' and user_to_update.user_type in ['admin', 'super_admin'] and current_user.id != user_to_update.id:
        return jsonify({'error': 'Admin users cannot update other admins or super admins'}), HTTP_403_FORBIDDEN
    
    data = request.get_json()

    # Super admin can update user_type, with a self-demotion check
    if current_user.user_type == 'super_admin' and 'user_type' in data:
        requested_user_type = data.get('user_type')
        if user_to_update.id == current_user.id and requested_user_type != 'super_admin':
            return jsonify({'error': 'Super Admin cannot demote themselves'}), HTTP_403_FORBIDDEN
        user_to_update.user_type = requested_user_type

    user_to_update.first_name = data.get('first_name', user_to_update.first_name)
    user_to_update.last_name = data.get('last_name', user_to_update.last_name)
    
    # Email and Contact update with conflict checks
    new_email = data.get('email', user_to_update.email)
    new_contact = data.get('contact', user_to_update.contact)

    if new_email != user_to_update.email and User.query.filter(User.email == new_email, User.id != user_to_update.id).first():
        return jsonify({"error": "Email already in use"}), HTTP_409_CONFLICT
    if new_contact != user_to_update.contact and User.query.filter(User.contact == new_contact, User.id != user_to_update.id).first():
        return jsonify({"error": "Contact already in use"}), HTTP_409_CONFLICT

    user_to_update.email = new_email
    user_to_update.contact = new_contact

    if 'password' in data and data['password']:
        if len(data['password']) < 8:
            return jsonify({'error': 'New password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
        user_to_update.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    try:
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user {id}: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# --- Delete user (admin/super_admin only) ---
@user.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_user(id):
    current_user_id = get_jwt_identity()
    current_user = db.session.get(User, current_user_id)
    user_to_delete = db.session.get(User, id)

    if not user_to_delete:
        return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

    if current_user.id == user_to_delete.id:
        return jsonify({'error': 'Cannot delete your own account'}), HTTP_403_FORBIDDEN

    if current_user.user_type == 'admin' and user_to_delete.user_type in ['admin', 'super_admin']:
        return jsonify({'error': 'Admin users cannot delete other admins or super admins'}), HTTP_403_FORBIDDEN

    try:
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user {id}: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# --- Get current logged-in user's profile ---
@user.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_item = db.session.get(User, get_jwt_identity())
    if not user_item:
        return jsonify({'error': 'User not found'}), HTTP_404_NOT_FOUND

    return jsonify({
        'id': user_item.id,
        'first_name': user_item.first_name,
        'last_name': user_item.last_name,
        'email': user_item.email,
        'contact': user_item.contact,
        'user_type': user_item.user_type,
        'created_at': user_item.created_at.isoformat() if user_item.created_at else None
    }), HTTP_200_OK

# --- Get users by role (e.g., user, admin, super_admin) ---
@user.route('/role/<string:role>', methods=['GET'])
@admin_required
def get_users_by_role(role):
    users = User.query.filter_by(user_type=role).all()
    result = [{
        'id': u.id,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'email': u.email,
        'contact': u.contact,
        'user_type': u.user_type,
        'created_at': u.created_at.isoformat() if u.created_at else None
    } for u in users]

    return jsonify({
        'message': f'{role.capitalize()}s retrieved',
        'total': len(result),
        'users': result
    }), HTTP_200_OK