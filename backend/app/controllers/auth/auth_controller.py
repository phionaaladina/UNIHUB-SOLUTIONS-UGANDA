# from flask import Blueprint, request, jsonify
# from app.status_codes import (
#     HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
#     HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED
# )
# from app.models.user import User
# from app.extensions import db, bcrypt
# from flask_jwt_extended import (
#     create_access_token, create_refresh_token,
#     jwt_required, get_jwt_identity
# )
# import validators

# auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

# # USER REGISTRATION
# @auth.route('/register', methods=['POST'])
# def register_user():
#     data = request.get_json()

#     first_name = data.get('first_name')
#     last_name = data.get('last_name')
#     contact = data.get('contact')
#     email = data.get('email')
#     password = data.get('password')
#     user_type = data.get('type', 'user')  # 'super_admin', 'admin', or 'user'

#     # Validation
#     if not all([first_name, last_name, contact, email, password]):
#         return jsonify({"error": "All fields are required"}), HTTP_400_BAD_REQUEST

#     if len(password) < 8:
#         return jsonify({"error": "Password must be at least 8 characters"}), HTTP_400_BAD_REQUEST

#     if not validators.email(email):
#         return jsonify({"error": "Invalid email address"}), HTTP_400_BAD_REQUEST

#     if User.query.filter_by(email=email).first():
#         return jsonify({"error": "Email is already registered"}), HTTP_409_CONFLICT

#     if User.query.filter_by(contact=contact).first():
#         return jsonify({"error": "Contact is already registered"}), HTTP_409_CONFLICT

#     try:
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

#         new_user = User(
#             first_name=first_name,
#             last_name=last_name,
#             email=email,
#             contact=contact,
#             password=hashed_password,
#             user_type=user_type
#         )

#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({
#             "message": f"{new_user.get_full_name()} registered successfully as {new_user.user_type}.",
#             "user": {
#                 "id": new_user.id,
#                 "first_name": new_user.first_name,
#                 "last_name": new_user.last_name,
#                 "email": new_user.email,
#                 "contact": new_user.contact,
#                 "user_type": new_user.user_type,
#                 "created_at": new_user.created_at
#             }
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR



# #USER LOGIN
# # @auth.route('/login', methods=['POST'])
# # def login():
# #     data = request.get_json()
# #     email = data.get('email')
# #     password = data.get('password')

# #     if not email or not password:
# #         return jsonify({"error": "Email and password are required"}), HTTP_400_BAD_REQUEST

# #     user = User.query.filter_by(email=email).first()

# #     if not user:
# #         return jsonify({"error": "Invalid email address"}), HTTP_401_UNAUTHORIZED

# #     if not bcrypt.check_password_hash(user.password, password):
# #         return jsonify({"error": "Invalid password"}), HTTP_401_UNAUTHORIZED

# #     identity = {
# #         "id": user.id,
# #         "email": user.email,
# #         "user_type": user.user_type
# #     }

# #     access_token = create_access_token(identity=identity)
# #     refresh_token = create_refresh_token(identity=identity)

# #     return jsonify({
# #         "message": "Login successful",
# #         "token": access_token,
# #         "refresh": refresh_token,
# #         "user": {
# #             "id": user.id,
# #             "name": f"{user.first_name} {user.last_name}",
# #             "email": user.email,
# #             "contact": user.contact,
# #             "user_type": user.user_type
# #         }
# #     }), HTTP_200_OK


# # # TOKEN REFRESH
# # @auth.route('/token/refresh', methods=['POST'])
# # @jwt_required(refresh=True)
# # def refresh_token():
# #     identity = get_jwt_identity()
# #     new_access_token = create_access_token(identity=identity)
# #     return jsonify(access_token=new_access_token), HTTP_200_OK


# @auth.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({"error": "Email and password are required"}), HTTP_400_BAD_REQUEST

#     user = User.query.filter_by(email=email).first()

#     if not user:
#         return jsonify({"error": "Invalid email address"}), HTTP_401_UNAUTHORIZED

#     if not bcrypt.check_password_hash(user.password, password):
#         return jsonify({"error": "Invalid password"}), HTTP_401_UNAUTHORIZED

#     # --- MODIFIED: Add additional_claims for user_type ---
#     additional_claims = {
#         "user_type": user.user_type # Include the user's type in the token payload
#     }

#     # Use user.id as JWT identity, and pass additional_claims
#     access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
#     refresh_token = create_refresh_token(identity=str(user.id), additional_claims=additional_claims) # Also for refresh token if needed

#     return jsonify({
#         "message": "Login successful",
#         "token": access_token,
#         "refresh": refresh_token,
#         "user": {
#             "id": user.id,
#             "name": f"{user.first_name} {user.last_name}",
#             "email": user.email,
#             "contact": user.contact,
#             "user_type": user.user_type # This is already in the response, good.
#         }
#     }), HTTP_200_OK

# #LOGOUT (Basic)
# @auth.route('/logout', methods=['POST'])
# @jwt_required()
# def logout():
#     return jsonify({'message': 'You have successfully logged out.'}), HTTP_200_OK




    
# # def login():
# #     data = request.get_json()
# #     email = data.get('email')
# #     password = data.get('password')

# #     if not email or not password:
# #         return jsonify({"error": "Email and password are required"}), HTTP_400_BAD_REQUEST

# #     user = User.query.filter_by(email=email).first()

# #     if not user:
# #         return jsonify({"error": "Invalid email address"}), HTTP_401_UNAUTHORIZED

# #     if not bcrypt.check_password_hash(user.password, password):
# #         return jsonify({"error": "Invalid password"}), HTTP_401_UNAUTHORIZED

# #     # ✅ Use user.id as JWT identity
# #     # access_token = create_access_token(identity=user.id)
# #     # refresh_token = create_refresh_token(identity=user.id)
# #     access_token = create_access_token(identity=str(user.id))
# #     refresh_token = create_refresh_token(identity=str(user.id))

# #     return jsonify({
# #         "message": "Login successful",
# #         "token": access_token,
# #         "refresh": refresh_token,
# #         "user": {
# #             "id": user.id,
# #             "name": f"{user.first_name} {user.last_name}",
# #             "email": user.email,
# #             "contact": user.contact,
# #             "user_type": user.user_type
# #         }
# #     }), HTTP_200_OK




# from flask import Blueprint, request, jsonify
# from app.status_codes import (
#     HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
#     HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED
# )
# from app.models.user import User # Assuming this correctly imports your User model
# from app.extensions import db, bcrypt # Assuming these are correctly initialized
# from flask_jwt_extended import (
#     create_access_token, create_refresh_token,jwt_required
#     #jwt_required, get_jwt_identity, additional_claims # Make sure additional_claims is imported
# )
# import validators # Assuming you have a validators library (e.g., email-validator)

# auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

# # USER REGISTRATION
# @auth.route('/register', methods=['POST'])
# def register_user():
#     data = request.get_json()

#     first_name = data.get('first_name')
#     last_name = data.get('last_name')
#     contact = data.get('contact')
#     email = data.get('email')
#     password = data.get('password')
#     user_type = data.get('type', 'user')  # 'super_admin', 'admin', or 'user'

#     # Validation
#     if not all([first_name, last_name, contact, email, password]):
#         return jsonify({"error": "All fields are required"}), HTTP_400_BAD_REQUEST

#     if len(password) < 8:
#         return jsonify({"error": "Password must be at least 8 characters"}), HTTP_400_BAD_REQUEST

#     if not validators.email(email):
#         return jsonify({"error": "Invalid email address"}), HTTP_400_BAD_REQUEST

#     if User.query.filter_by(email=email).first():
#         return jsonify({"error": "Email is already registered"}), HTTP_409_CONFLICT

#     if User.query.filter_by(contact=contact).first():
#         return jsonify({"error": "Contact is already registered"}), HTTP_409_CONFLICT

#     try:
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

#         new_user = User(
#             first_name=first_name,
#             last_name=last_name,
#             email=email,
#             contact=contact,
#             password=hashed_password,
#             user_type=user_type
#         )

#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({
#             "message": f"{new_user.first_name} {new_user.last_name} registered successfully as {new_user.user_type}.",
#             "user": {
#                 "id": new_user.id,
#                 "first_name": new_user.first_name,
#                 "last_name": new_user.last_name,
#                 "email": new_user.email,
#                 "contact": new_user.contact,
#                 "user_type": new_user.user_type,
#                 "created_at": new_user.created_at # Assuming created_at is an attribute
#             }
#         }), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         # Log the full exception for debugging in your server logs
#         print(f"Error during user registration: {e}")
#         return jsonify({"error": "An unexpected error occurred during registration."}), HTTP_500_INTERNAL_SERVER_ERROR


# # USER LOGIN (MODIFIED)
# @auth.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({"error": "Email and password are required"}), HTTP_400_BAD_REQUEST

#     user = User.query.filter_by(email=email).first()

#     if not user:
#         return jsonify({"error": "Invalid email address"}), HTTP_401_UNAUTHORIZED

#     # Assuming User model has a check_password method or you verify directly
#     if not bcrypt.check_password_hash(user.password, password):
#         return jsonify({"error": "Invalid password"}), HTTP_401_UNAUTHORIZED

#     # --- CRITICAL MODIFICATION: Add first_name and last_name to JWT claims ---
#     claims = {
#         "user_type": user.user_type,
#         "first_name": user.first_name, # <-- ADDED THIS
#         "last_name": user.last_name    # <-- ADDED THIS
#     }

#     # Use user.id as JWT identity, and pass additional_claims
#     # Identity typically stores unique identifier, claims carry additional data
#     access_token = create_access_token(identity=str(user.id), additional_claims=claims)
#     refresh_token = create_refresh_token(identity=str(user.id), additional_claims=claims)

#     return jsonify({
#         "message": "Login successful",
#         "token": access_token,  # This JWT now contains first_name and last_name
#         "refresh": refresh_token,
#         "user": { # This 'user' object is for convenience/non-JWT data, not for JWT parsing
#             "id": user.id,
#             "name": f"{user.first_name} {user.last_name}", # Full name for immediate display if desired
#             "email": user.email,
#             "contact": user.contact,
#             "user_type": user.user_type
#         }
#     }), HTTP_200_OK

# # LOGOUT (Basic)
# @auth.route('/logout', methods=['POST'])
# @jwt_required()
# def logout():
#     # In a real application, you might revoke the token here (e.g., blacklist)
#     return jsonify({'message': 'You have successfully logged out.'}), HTTP_200_OK





import os
from flask import Blueprint, request, jsonify, current_app
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_201_CREATED, HTTP_403_FORBIDDEN # Added HTTP_403
)
from app.models.user import User
from app.extensions import db, bcrypt
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt # <-- Make sure get_jwt is imported
)
import validators
from werkzeug.utils import secure_filename # For safe filenames

auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

# Define allowed extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# USER REGISTRATION
@auth.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    first_name = data.get('first_name')
    last_name = data.get('last_name')
    contact = data.get('contact')
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('type', 'user')  # 'super_admin', 'admin', or 'user'

    # Validation
    if not all([first_name, last_name, contact, email, password]):
        return jsonify({"error": "All fields are required"}), HTTP_400_BAD_REQUEST

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return jsonify({"error": "Invalid email address"}), HTTP_400_BAD_REQUEST

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already registered"}), HTTP_409_CONFLICT

    if User.query.filter_by(contact=contact).first():
        return jsonify({"error": "Contact is already registered"}), HTTP_409_CONFLICT

    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            contact=contact,
            password=hashed_password,
            user_type=user_type
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": f"{new_user.first_name} {new_user.last_name} registered successfully as {new_user.user_type}.",
            "user": {
                "id": new_user.id,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "email": new_user.email,
                "contact": new_user.contact,
                "user_type": new_user.user_type,
                "created_at": new_user.created_at # Assuming created_at is an attribute
            }
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error during user registration: {e}") # Use current_app.logger for better logging
        return jsonify({"error": "An unexpected error occurred during registration."}), HTTP_500_INTERNAL_SERVER_ERROR


# USER LOGIN
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), HTTP_400_BAD_REQUEST

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email address"}), HTTP_401_UNAUTHORIZED

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), HTTP_401_UNAUTHORIZED

    claims = {
        "user_type": user.user_type,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "name": f"{user.first_name} {user.last_name}",  # Added for frontend compatibility
        "email": user.email,  # Added custom claim
        "contact": user.contact,  # Added custom claim
        "profile_picture_url": user.profile_picture_url
    }

    access_token = create_access_token(identity=str(user.id), additional_claims=claims)
    refresh_token = create_refresh_token(identity=str(user.id), additional_claims=claims)

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "refresh": refresh_token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "contact": user.contact,
            "user_type": user.user_type,
            "profile_picture_url": user.profile_picture_url
        }
    }), HTTP_200_OK
# @auth.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({"error": "Email and password are required"}), HTTP_400_BAD_REQUEST

#     user = User.query.filter_by(email=email).first()

#     if not user:
#         return jsonify({"error": "Invalid email address"}), HTTP_401_UNAUTHORIZED

#     if not bcrypt.check_password_hash(user.password, password):
#         return jsonify({"error": "Invalid password"}), HTTP_401_UNAUTHORIZED

#     claims = {
#         "user_type": user.user_type,
#         "first_name": user.first_name,
#         "last_name": user.last_name,
#         "profile_picture_url": user.profile_picture_url # <-- ADDED: Include profile pic URL in claims
#     }

#     access_token = create_access_token(identity=str(user.id), additional_claims=claims)
#     refresh_token = create_refresh_token(identity=str(user.id), additional_claims=claims)

#     return jsonify({
#         "message": "Login successful",
#         "token": access_token,
#         "refresh": refresh_token,
#         "user": {
#             "id": user.id,
#             "first_name": user.first_name, # Return individual names too
#             "last_name": user.last_name,
#             "name": f"{user.first_name} {user.last_name}",
#             "email": user.email,
#             "contact": user.contact,
#             "user_type": user.user_type,
#             "profile_picture_url": user.profile_picture_url # Return for immediate use
#         }
#     }), HTTP_200_OK

# LOGOUT (Basic)
@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'You have successfully logged out.'}), HTTP_200_OK

# --- NEW: Profile Picture Upload Route for ANY authenticated user ---
@auth.route('/profile/picture', methods=['POST'])
@jwt_required() # Protect this route with JWT
def upload_profile_picture():
    user_id = get_jwt_identity() # Get user ID from JWT
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), HTTP_401_UNAUTHORIZED

    if 'profile_picture' not in request.files:
        return jsonify({"message": "No profile_picture file part in the request"}), HTTP_400_BAD_REQUEST

    file = request.files['profile_picture']

    if file.filename == '':
        return jsonify({"message": "No selected file"}), HTTP_400_BAD_REQUEST

    if file and allowed_file(file.filename):
        try:
            # Create a unique filename based on user ID and original extension
            # Ensure the filename is safe for the filesystem
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = secure_filename(f"{user.id}_profile_pic.{ext}")
            
            # Define the upload folder. It should be configured in your config.py
            upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
            os.makedirs(upload_folder, exist_ok=True) # Ensure directory exists

            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

            # Update the user's profile_picture_url in the database
            # The URL should be accessible from the frontend, e.g., /uploads/filename.
            user.profile_picture_url = f"/uploads/{filename}" # Store relative URL
            db.session.commit()

            return jsonify({
                "message": "Profile picture uploaded successfully!",
                "profile_pic_url": user.profile_picture_url # Return the new URL
            }), HTTP_200_OK
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error uploading profile picture for user {user_id}: {e}")
            return jsonify({"message": "Failed to upload profile picture due to server error"}), HTTP_500_INTERNAL_SERVER_ERROR
    else:
        return jsonify({"message": "Invalid file type. Allowed types: png, jpg, jpeg, gif"}), HTTP_400_BAD_REQUEST

# --- NEW: Change Password Route for ANY authenticated user ---
@auth.route('/profile/change_password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), HTTP_401_UNAUTHORIZED

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"message": "Current and new password are required"}), HTTP_400_BAD_REQUEST

    if not bcrypt.check_password_hash(user.password, current_password):
        return jsonify({"message": "Incorrect current password"}), HTTP_401_UNAUTHORIZED

    if len(new_password) < 8: # Example validation
        return jsonify({"message": "New password must be at least 8 characters long"}), HTTP_400_BAD_REQUEST

    try:
        user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({"message": "Password changed successfully!"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error changing password for user {user_id}: {e}")
        return jsonify({"message": "Failed to change password due to server error"}), HTTP_500_INTERNAL_SERVER_ERROR

# --- NEW: Get User Profile Details (e.g., for general profile page) ---
@auth.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), HTTP_401_UNAUTHORIZED

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "contact": user.contact,
        "user_type": user.user_type,
        "profile_picture_url": user.profile_picture_url,
        "created_at": user.created_at
    }), HTTP_200_OK

# --- NEW: Update Basic Profile Info (name, contact, etc.) ---
@auth.route('/profile/update', methods=['PUT'])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), HTTP_401_UNAUTHORIZED

    data = request.get_json()
    first_name = data.get('first_name', user.first_name)
    last_name = data.get('last_name', user.last_name)
    contact = data.get('contact', user.contact)
    email = data.get('email', user.email) # Email change should be handled carefully (verification)

    # Basic validation (can be expanded)
    if not all([first_name, last_name, contact, email]):
        return jsonify({"message": "All fields are required"}), HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return jsonify({"error": "Invalid email address"}), HTTP_400_BAD_REQUEST

    # Check for email/contact conflicts if they are being changed
    if email != user.email and User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already taken by another user."}), HTTP_409_CONFLICT
    
    if contact != user.contact and User.query.filter_by(contact=contact).first():
        return jsonify({"error": "Contact is already taken by another user."}), HTTP_409_CONFLICT

    try:
        user.first_name = first_name
        user.last_name = last_name
        user.contact = contact
        user.email = email
        
        db.session.commit()
        return jsonify({
            "message": "Profile updated successfully!",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "contact": user.contact,
                "user_type": user.user_type,
                "profile_picture_url": user.profile_picture_url
            }
        }), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating profile for user {user_id}: {e}")
        return jsonify({"message": "Failed to update profile due to server error"}), HTTP_500_INTERNAL_SERVER_ERROR