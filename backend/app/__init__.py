from flask import Flask, send_from_directory
from flask_cors import CORS
from app.extensions import db, migrate, jwt
from flask_mail import Mail # <--- IMPORT FLASK-MAIL

# Blueprints
from app.controllers.auth.auth_controller import auth
from app.controllers.users.user_controller import user
from app.controllers.categories.category_controller import category 
from app.controllers.products.product_controller import product 
from app.controllers.news.news_controller import news
from app.controllers.cart.cart_controller import cart
from app.controllers.contactMessage.contactMessage_controller import contact 
from app.controllers.chat.chat_controller import chat
from app.controllers.orders.order_controller import order
from app.controllers.sales.sale_controller import sale
from app.controllers.discount.discount_controller import discount


# Initialize Mail outside create_app so it can be imported by blueprints
mail = Mail() # <--- INITIALIZE MAIL INSTANCE GLOBALLY

def create_app():
    app = Flask(__name__)
    CORS(app) 
    # CORS(app, origins = ["http://unihubug.com/"])  # Enable CORS for all routes
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app) # <--- CRUCIAL: INITIALIZE MAIL WITH THE APP INSTANCE

    # Import models for migrations
    from app.models.user import User
    from app.models.category import Category
    from app.models.product import Product
    from app.models.order import Order
    from app.models.orderItem import OrderItem
    from app.models.sale import Sale
    from app.models.news import News
    from app.models.contactMessage import ContactMessage
    from app.models.cart import Cart, CartItem
    from app.models.discount import Discount
    from app.models.chat import Chat
    from app.models.discount import Discount
   

    # Register blueprints only
    app.register_blueprint(auth)
    app.register_blueprint(user)
    app.register_blueprint(category)
    app.register_blueprint(product)
    app.register_blueprint(news)
    app.register_blueprint(cart)  # Only blueprint
    app.register_blueprint(contact)  # Only blueprint for contact messages
    app.register_blueprint(chat)
    app.register_blueprint(order)  # Only blueprint for orders
    app.register_blueprint(sale)  # Only blueprint for sales
    app.register_blueprint(discount)  # Only blueprint for discounts
    


    # --- IMPORTANT: Route to serve uploaded files statically ---
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        # Ensure the path is correct based on your UPLOAD_FOLDER config
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    # This creates an endpoint like http://127.0.0.1:5000/uploads/your_image.png
    
    
    @app.route('/')
    def home():
        return 'UNIHUB SOLUTIONS UGANDA'
    
    return app















# from flask import Flask
# from app.extensions import db, migrate, jwt
# from app.controllers.auth.auth_controller import auth
# from app.controllers.users.user_controller import user
# from app.controllers.categories.category_controller import category 
# from app.controllers.products.product_controller import product 
# from app.controllers.news.news_controller import news
# from app.controllers.cart.cart_controller import cart
# from app.models.cart import Cart, CartItem
# from app.models.discount import Discount





# def create_app():
#     #application factory function
#     app = Flask (__name__)
#     app.config.from_object('config.Config')

#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)

#     #importing and registering models
#     from app.models.user import User
#     from app.models.category import Category
#     from app.models.product import Product
#     from app.models.order import Order
#     from app.models.orderItem import OrderItem
#     from app.models.sale import Sale
#     from app.models.news import News
#     from app.models.contactMessage import ContactMessage
#     from app.models.cart import Cart
#     from app.models.cart import CartItem
#     from app.models.discount import Discount
#     from app.models.chat import Chat



#     #registering blueprints
#     app.register_blueprint(auth)
#     app.register_blueprint(user)
#     app.register_blueprint(category)
#     app.register_blueprint(product)
#     app.register_blueprint(news)
#     app.register_blueprint(cart)
#     app.register_blueprint(CartItem)
#     app.register_blueprint(Discount)
#     app.register_blueprint(Cart)




#     @app.route('/')
#     def home():
#         return 'UNIHUB SOLUTIONS UGANDA'
    
#     return app