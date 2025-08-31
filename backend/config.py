# from datetime import timedelta

# class Config:
#      SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/unihub_db'
#      JWT_SECRET_KEY = "unihub" 
#      JWT_EXPIRATION_DELTA = timedelta(hours=24)


#      # backend/config.py

# # ... other configurations ...

# # Flask-Mail Configuration
# MAIL_SERVER = 'smtp.gmail.com'
# MAIL_PORT = 587
# MAIL_USE_TLS = True
# MAIL_USE_SSL = False
# MAIL_USERNAME = 'unihub.notifications@gmail.com' # Make sure this is the email you just generated the App Password for
# MAIL_PASSWORD = 'phktpwcbcsxuzwrf' # <--- Your App Password goes here!
# MAIL_DEFAULT_SENDER = 'unihub.notifications@gmail.com' # Or 'UniHub Notifications <your_email@gmail.com>'



from datetime import timedelta
import os # Import os for path operations

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/unihub_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Good practice to keep this False

    # JWT Configuration
    JWT_SECRET_KEY = "unihub" # IMPORTANT: Change this to a strong, random string in production!
    
    # NOTE: JWT_EXPIRATION_DELTA is for older Flask-JWT-Extended versions.
    # For Flask-JWT-Extended 4.x.x+, use JWT_ACCESS_TOKEN_EXPIRES and JWT_REFRESH_TOKEN_EXPIRES (in seconds).
    # I'll include both for now, but you should transition to the newer ones.
    JWT_EXPIRATION_DELTA = timedelta(hours=24) # Still here for compatibility if needed elsewhere
    JWT_ACCESS_TOKEN_EXPIRES = 3600 # 1 hour (example, adjust as needed)
    JWT_REFRESH_TOKEN_EXPIRES = 2592000 # 30 days (example, adjust as needed)

    # --- NEW: File Upload Configuration ---
    # This is the directory where uploaded files (like profile pictures) will be saved.
    # It will be a folder named 'uploads' in your backend's root directory.
    UPLOAD_FOLDER = 'uploads'
    
    # Maximum content length for uploaded files (16 MB)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    # --- END NEW ---

    # Flask-Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False # Keep this False if using MAIL_USE_TLS True
    MAIL_USERNAME = 'unihub.notifications@gmail.com'
    MAIL_PASSWORD = 'phktpwcbcsxuzwrf' # Your App Password
    MAIL_DEFAULT_SENDER = 'unihub.notifications@gmail.com' # Or 'UniHub Notifications <your_email@gmail.com>'