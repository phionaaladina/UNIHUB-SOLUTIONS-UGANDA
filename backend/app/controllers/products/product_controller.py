# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.extensions import db
# from app.models.product import Product
# from app.models.category import Category
# from app.models.user import User
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_409_CONFLICT,
#     HTTP_500_INTERNAL_SERVER_ERROR
# )

# product = Blueprint('products', __name__, url_prefix='/api/v1/products')

# # Helper to serialize product with category info
# def serialize_product(p):
#     category = Category.query.get(p.category_id)
#     return {
#         'id': p.product_id,
#         'image_url': p.image_url,
#         'name': p.name,
#         'brand': p.brand,
#         'description': p.description,
#         'price': p.price,
#         'date_created': p.date_created.isoformat(), # Often good practice for dates
#         'stock': p.stock, # <--- ADD THIS LINE
#         'category': {
#             'id': category.category_id,
#             'name': category.name,
#             'description': category.description
#         } if category else None
#     }

# # Create a single product (admin only)
# @product.route('/create', methods=['POST'])
# @jwt_required()
# def create_product():
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can create products'}), HTTP_403_FORBIDDEN

#         data = request.get_json()
#         if isinstance(data, list):
#             return jsonify({'error': 'Use batch upload endpoint for multiple products'}), HTTP_400_BAD_REQUEST

#         name = data.get('name')
#         price = data.get('price')
#         category_id = data.get('category_id')
#         stock = data.get('stock') # <--- Get stock from request data

#         if not all([name, price, category_id, stock is not None]): # <--- Check for stock too
#             return jsonify({'error': 'name, price, category_id, and stock are required'}), HTTP_400_BAD_REQUEST

#         if Product.query.filter_by(name=name).first():
#             return jsonify({'error': f'Product with name "{name}" already exists'}), HTTP_409_CONFLICT

#         if not Category.query.get(category_id):
#             return jsonify({'error': 'Category not found'}), HTTP_404_NOT_FOUND

#         product = Product(
#             name=name,
#             description=data.get('description', ''),
#             price=price,
#             category_id=category_id,
#             image_url=data.get('image_url', ''), # <--- Ensure image_url is passed
#             brand=data.get('brand', ''), # <--- Ensure brand is passed
#             stock=stock # <--- Pass stock to the Product constructor
#         )

#         db.session.add(product)
#         db.session.commit()

#         return jsonify({'message': 'Product created successfully', 'product': serialize_product(product)}), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Batch product upload (admin only)
# @product.route('/batch', methods=['POST'])
# @jwt_required()
# def batch_upload_products():
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can batch upload products'}), HTTP_403_FORBIDDEN

#         data = request.get_json()
#         if not isinstance(data, list):
#             return jsonify({'error': 'Expected a list of product objects'}), HTTP_400_BAD_REQUEST

#         created = []
#         errors = []

#         for idx, item in enumerate(data, start=1):
#             name = item.get('name')
#             price = item.get('price')
#             category_id = item.get('category_id')
#             stock = item.get('stock') # <--- Get stock from item data

#             if not all([name, price, category_id, stock is not None]): # <--- Check for stock too
#                 errors.append({'item': idx, 'error': 'name, price, category_id, and stock are required'})
#                 continue

#             if Product.query.filter_by(name=name).first():
#                 errors.append({'item': idx, 'error': f'Product name "{name}" already exists'})
#                 continue

#             if not Category.query.get(category_id):
#                 errors.append({'item': idx, 'error': 'Category not found'})
#                 continue

#             product = Product(
#                 name=name,
#                 description=item.get('description', ''),
#                 price=price,
#                 category_id=category_id,
#                 image_url=item.get('image_url', ''), # <--- Ensure image_url is passed
#                 brand=item.get('brand', ''), # <--- Ensure brand is passed
#                 stock=stock # <--- Pass stock to the Product constructor
#             )
#             db.session.add(product)
#             created.append(product)

#         if created:
#             db.session.commit()

#         return jsonify({
#             'message': f'{len(created)} products created',
#             'created': [serialize_product(p) for p in created],
#             'errors': errors
#         }), HTTP_201_CREATED if created else HTTP_400_BAD_REQUEST

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get products with pagination & filtering (public)
# @product.route('/', methods=['GET'])
# def get_products():
#     try:
#         page = int(request.args.get('page', 1))
#         per_page = int(request.args.get('per_page', 10))
#         search = request.args.get('search', '').strip()
#         category_filter = request.args.get('category_id')

#         query = Product.query.join(Category, isouter=True)

#         if search:
#             query = query.filter(
#                 db.or_(
#                     Product.name.ilike(f'%{search}%'),
#                     Product.brand.ilike(f'%{search}%'),
#                     Category.name.ilike(f'%{search}%')
#                 )
#             )

#         if category_filter:
#             query = query.filter(Product.category_id == category_filter)

#         paginated = query.order_by(Product.date_created.desc()).paginate(
#             page=page,
#             per_page=per_page,
#             error_out=False
#         )

#         products = paginated.items

#         return jsonify({
#             'message': 'Products retrieved successfully',
#             'total': paginated.total,
#             'page': paginated.page,
#             'pages': paginated.pages,
#             'products': [serialize_product(p) for p in products]
#         }), HTTP_200_OK

#     except Exception as e:
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get product by ID with category info
# @product.route('/<int:id>', methods=['GET'])
# def get_product(id):
#     try:
#         product = Product.query.get_or_404(id)
#         return jsonify(serialize_product(product)), HTTP_200_OK
#     except Exception as e:
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Update product (admin only)
# @product.route('/<int:id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_product(id):
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can update products'}), HTTP_403_FORBIDDEN

#         product = Product.query.get_or_404(id)
#         data = request.get_json()

#         if 'name' in data and data['name'] != product.name:
#             if Product.query.filter_by(name=data['name']).first():
#                 return jsonify({'error': 'Product name already exists'}), HTTP_409_CONFLICT
#             product.name = data['name']

#         product.description = data.get('description', product.description)
#         product.price = data.get('price', product.price)
#         product.image_url = data.get('image_url', product.image_url) # <--- Update image_url
#         product.brand = data.get('brand', product.brand) # <--- Update brand
#         product.stock = data.get('stock', product.stock) # <--- ADD THIS LINE for updating stock

#         category_id = data.get('category_id', product.category_id)
#         if category_id != product.category_id:
#             if not Category.query.get(category_id):
#                 return jsonify({'error': 'Category not found'}), HTTP_404_NOT_FOUND
#             product.category_id = category_id

#         db.session.commit()

#         return jsonify({'message': 'Product updated successfully', 'product': serialize_product(product)}), HTTP_200_OK

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Delete product (admin only)
# @product.route('delete/<int:id>', methods=['DELETE'])
# @jwt_required()
# def delete_product(id):
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can delete products'}), HTTP_403_FORBIDDEN

#         product = Product.query.get_or_404(id)
#         db.session.delete(product)
#         db.session.commit()

#         return jsonify({'message': 'Product deleted successfully'}), HTTP_200_OK

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# @product.route('/test', methods=['GET'])
# def test_api():
#     return jsonify({"message": "Backend is working!"})




# from flask import Blueprint, request, jsonify, current_app # Added current_app for logging
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.extensions import db
# from app.models.product import Product
# from app.models.category import Category
# from app.models.user import User
# from app.status_codes import (
#     HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
#     HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_409_CONFLICT,
#     HTTP_500_INTERNAL_SERVER_ERROR
# )

# product = Blueprint('products', __name__, url_prefix='/api/v1/products')

# # Helper to serialize product with category info
# def serialize_product(p):
#     category = Category.query.get(p.category_id)
#     return {
#         'id': p.product_id,
#         'image_url': p.image_url,
#         'name': p.name,
#         'brand': p.brand,
#         'description': p.description,
#         'price': p.price,
#         'date_created': p.date_created.isoformat() if p.date_created else None,
#         'stock': p.stock,
#         'category': {
#             'id': category.category_id,
#             'name': category.name,
#             'description': category.description
#         } if category else None
#     }

# # Create a single product (admin only)
# @product.route('/create', methods=['POST'])
# @jwt_required()
# def create_product():
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if not current_user or current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can create products'}), HTTP_403_FORBIDDEN

#         data = request.get_json()
#         if isinstance(data, list):
#             return jsonify({'error': 'Use batch upload endpoint for multiple products'}), HTTP_400_BAD_REQUEST

#         name = data.get('name')
#         price = data.get('price')
#         category_id = data.get('category_id')
#         stock = data.get('stock')

#         # Convert empty strings to None for optional fields if they are nullable in the model
#         # This assumes description, image_url, brand are nullable=True in your Product model
#         description = data.get('description')
#         if description == '':
#             description = None

#         image_url = data.get('image_url')
#         if image_url == '':
#             image_url = None
        
#         brand = data.get('brand')
#         if brand == '':
#             brand = None

#         # Validate required fields: name must be truthy, others must not be None
#         if not all([name, price is not None, category_id is not None, stock is not None]):
#             return jsonify({'error': 'Name, Price, Category, and Stock are required fields.'}), HTTP_400_BAD_REQUEST

#         # Explicitly convert to correct types and handle potential errors
#         try:
#             price = float(price)
#             stock = int(stock)
#             category_id = int(category_id)
#         except (ValueError, TypeError):
#             return jsonify({'error': 'Price, Stock, or Category ID must be valid numbers.'}), HTTP_400_BAD_REQUEST

#         if Product.query.filter_by(name=name).first():
#             return jsonify({'error': f'Product with name "{name}" already exists'}), HTTP_409_CONFLICT

#         if not Category.query.get(category_id):
#             return jsonify({'error': 'Category not found'}), HTTP_404_NOT_FOUND

#         product = Product(
#             name=name,
#             description=description, # Use processed description (None or value)
#             price=price,
#             category_id=category_id,
#             image_url=image_url, # Use processed image_url (None or value)
#             brand=brand, # Use processed brand (None or value)
#             stock=stock
#         )

#         db.session.add(product)
#         db.session.commit()

#         return jsonify({'message': 'Product created successfully', 'product': serialize_product(product)}), HTTP_201_CREATED

#     except Exception as e:
#         db.session.rollback()
#         # Log the full exception for debugging on the server side
#         current_app.logger.error(f"Error creating product: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# # Batch product upload (admin only)
# @product.route('/batch', methods=['POST'])
# @jwt_required()
# def batch_upload_products():
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if not current_user or current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can batch upload products'}), HTTP_403_FORBIDDEN

#         data = request.get_json()
#         if not isinstance(data, list):
#             return jsonify({'error': 'Expected a list of product objects'}), HTTP_400_BAD_REQUEST

#         created = []
#         errors = []

#         for idx, item in enumerate(data, start=1):
#             name = item.get('name')
#             price = item.get('price')
#             category_id = item.get('category_id')
#             stock = item.get('stock')

#             # Convert empty strings to None for optional fields
#             description = item.get('description')
#             if description == '':
#                 description = None

#             image_url = item.get('image_url')
#             if image_url == '':
#                 image_url = None
            
#             brand = item.get('brand')
#             if brand == '':
#                 brand = None

#             if not all([name, price is not None, category_id is not None, stock is not None]):
#                 errors.append({'item': idx, 'error': 'name, price, category_id, and stock are required'})
#                 continue
            
#             try:
#                 price = float(price)
#                 stock = int(stock)
#                 category_id = int(category_id)
#             except (ValueError, TypeError):
#                 errors.append({'item': idx, 'error': 'Price, Stock, or Category ID must be valid numbers.'})
#                 continue

#             if Product.query.filter_by(name=name).first():
#                 errors.append({'item': idx, 'error': f'Product name "{name}" already exists'})
#                 continue

#             if not Category.query.get(category_id):
#                 errors.append({'item': idx, 'error': 'Category not found'})
#                 continue

#             product = Product(
#                 name=name,
#                 description=description,
#                 price=price,
#                 category_id=category_id,
#                 image_url=image_url,
#                 brand=brand,
#                 stock=stock
#             )
#             db.session.add(product)
#             created.append(product)

#         if created:
#             db.session.commit()

#         return jsonify({
#             'message': f'{len(created)} products created',
#             'created': [serialize_product(p) for p in created],
#             'errors': errors
#         }), HTTP_201_CREATED if created else HTTP_400_BAD_REQUEST

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error batch uploading products: {e}", exc_info=True)
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get products with pagination & filtering (public)
# @product.route('/', methods=['GET'])
# def get_products():
#     try:
#         page = int(request.args.get('page', 1))
#         per_page = int(request.args.get('per_page', 10))
#         search = request.args.get('search', '').strip()
#         category_filter = request.args.get('category_id')

#         query = Product.query.join(Category, isouter=True)

#         if search:
#             query = query.filter(
#                 db.or_(
#                     Product.name.ilike(f'%{search}%'),
#                     Product.brand.ilike(f'%{search}%'),
#                     Category.name.ilike(f'%{search}%')
#                 )
#             )

#         if category_filter:
#             try:
#                 category_filter = int(category_filter)
#                 query = query.filter(Product.category_id == category_filter)
#             except (ValueError, TypeError):
#                 return jsonify({'error': 'Invalid category_id filter.'}), HTTP_400_BAD_REQUEST


#         paginated = query.order_by(Product.date_created.desc()).paginate(
#             page=page,
#             per_page=per_page,
#             error_out=False
#         )

#         products = paginated.items

#         return jsonify({
#             'message': 'Products retrieved successfully',
#             'total': paginated.total,
#             'page': paginated.page,
#             'pages': paginated.pages,
#             'products': [serialize_product(p) for p in products]
#         }), HTTP_200_OK

#     except Exception as e:
#         current_app.logger.error(f"Error getting products: {e}", exc_info=True)
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# # Get product by ID with category info
# @product.route('/<int:id>', methods=['GET'])
# def get_product(id):
#     try:
#         product = Product.query.get_or_404(id)
#         return jsonify(serialize_product(product)), HTTP_200_OK
#     except Exception as e:
#         current_app.logger.error(f"Error getting product {id}: {e}", exc_info=True)
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# # Update product (admin only)
# @product.route('/<int:id>', methods=['PUT', 'PATCH'])
# @jwt_required()
# def update_product(id):
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if not current_user or current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can update products'}), HTTP_403_FORBIDDEN

#         product = Product.query.get_or_404(id)
#         data = request.get_json()

#         if 'name' in data and data['name'] != product.name:
#             if Product.query.filter_by(name=data['name']).first():
#                 return jsonify({'error': 'Product name already exists'}), HTTP_409_CONFLICT
#             product.name = data['name']

#         # Handle optional fields: if they are provided as empty strings, convert to None
#         # This assumes your Product model columns for description, image_url, brand are nullable=True
#         if 'description' in data:
#             product.description = data['description'] if data['description'] != '' else None
#         if 'image_url' in data:
#             product.image_url = data['image_url'] if data['image_url'] != '' else None
#         if 'brand' in data:
#             product.brand = data['brand'] if data['brand'] != '' else None

#         # Update price and stock, ensuring they are numbers
#         if 'price' in data:
#             try:
#                 product.price = float(data['price'])
#             except (ValueError, TypeError):
#                 return jsonify({'error': 'Price must be a valid number.'}), HTTP_400_BAD_REQUEST
        
#         if 'stock' in data:
#             try:
#                 product.stock = int(data['stock'])
#             except (ValueError, TypeError):
#                 return jsonify({'error': 'Stock must be a valid integer.'}), HTTP_400_BAD_REQUEST


#         # Handle category_id update
#         if 'category_id' in data:
#             category_id = data['category_id']
#             try:
#                 category_id = int(category_id)
#             except (ValueError, TypeError):
#                 return jsonify({'error': 'Category ID must be a valid integer.'}), HTTP_400_BAD_REQUEST

#             if not Category.query.get(category_id):
#                 return jsonify({'error': 'Category not found'}), HTTP_404_NOT_FOUND
#             product.category_id = category_id

#         db.session.commit()

#         return jsonify({'message': 'Product updated successfully', 'product': serialize_product(product)}), HTTP_200_OK

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error updating product {id}: {e}", exc_info=True)
#         return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# # Delete product (admin only)
# @product.route('delete/<int:id>', methods=['DELETE'])
# @jwt_required()
# def delete_product(id):
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         if not current_user or current_user.user_type not in ['admin', 'super_admin']:
#             return jsonify({'error': 'Only admins can delete products'}), HTTP_403_FORBIDDEN

#         product = Product.query.get_or_404(id)
#         db.session.delete(product)
#         db.session.commit()

#         return jsonify({'message': 'Product deleted successfully'}), HTTP_200_OK

#     except Exception as e:
#         db.session.rollback()
#         current_app.logger.error(f"Error deleting product {id}: {e}", exc_info=True)
#         return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# @product.route('/test', methods=['GET'])
# def test_api():
#     return jsonify({"message": "Backend is working!"})




#wkwk
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.product import Product
from app.models.category import Category
from app.models.user import User
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR
)

product = Blueprint('products', __name__, url_prefix='/api/v1/products')

# Helper to serialize product with category info
def serialize_product(p):
    category = Category.query.get(p.category_id)
    return {
        'id': p.product_id,
        'image_url': p.image_url,
        'name': p.name,
        'brand': p.brand,
        'description': p.description,
        'price': p.price,
        'date_created': p.date_created.isoformat() if p.date_created else None,
        'stock': p.stock,
        'category': {
            'id': category.category_id,
            'name': category.name,
            'description': category.description
        } if category else None
    }

# Create a single product (admin only)
@product.route('/create', methods=['POST'])
@jwt_required()
def create_product():
    try:
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.user_type not in ['admin', 'super_admin']:
            return jsonify({'error': 'Only admins can create products'}), HTTP_403_FORBIDDEN

        data = request.get_json()
        if isinstance(data, list):
            return jsonify({'error': 'Use batch upload endpoint for multiple products'}), HTTP_400_BAD_REQUEST

        name = data.get('name')
        price_raw = data.get('price')
        category_id_raw = data.get('category_id')
        stock_raw = data.get('stock')

        image_url = data.get('image_url', '')
        if image_url is None:
            image_url = ''

        description = data.get('description')
        if description == '':
            description = None
        
        brand = data.get('brand')
        if brand == '':
            brand = None

        if not all([name, price_raw is not None, category_id_raw is not None, stock_raw is not None]):
            return jsonify({'error': 'Name, Price, Category, and Stock are required fields.'}), HTTP_400_BAD_REQUEST

        try:
            price = float(price_raw)
            stock = int(stock_raw)
            category_id = int(category_id_raw)
        except (ValueError, TypeError):
            return jsonify({'error': 'Price, Stock, or Category ID must be valid numbers.'}), HTTP_400_BAD_REQUEST

        if Product.query.filter_by(name=name).first():
            return jsonify({'error': f'Product with name "{name}" already exists'}), HTTP_409_CONFLICT

        if not Category.query.get(category_id):
            return jsonify({'error': 'Category not found'}), HTTP_404_NOT_FOUND

        product = Product(
            name=name,
            description=description,
            price=price,
            category_id=category_id,
            image_url=image_url,
            brand=brand,
            stock=stock
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({'message': 'Product created successfully', 'product': serialize_product(product)}), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating product: {e}", exc_info=True)
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# Batch product upload (admin only)
@product.route('/batch', methods=['POST'])
@jwt_required()
def batch_upload_products():
    try:
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.user_type not in ['admin', 'super_admin']:
            return jsonify({'error': 'Only admins can batch upload products'}), HTTP_403_FORBIDDEN

        data = request.get_json()
        if not isinstance(data, list):
            return jsonify({'error': 'Expected a list of product objects'}), HTTP_400_BAD_REQUEST

        created = []
        errors = []

        for idx, item in enumerate(data, start=1):
            name = item.get('name')
            price_raw = item.get('price')
            category_id_raw = item.get('category_id')
            stock_raw = item.get('stock')

            image_url = item.get('image_url', '')
            if image_url is None:
                image_url = ''
            
            description = item.get('description')
            if description == '':
                description = None
            
            brand = item.get('brand')
            if brand == '':
                brand = None

            if not all([name, price_raw is not None, category_id_raw is not None, stock_raw is not None]):
                errors.append({'item': idx, 'error': 'name, price, category_id, and stock are required'})
                continue
            
            try:
                price = float(price_raw)
                stock = int(stock_raw)
                category_id = int(category_id_raw)
            except (ValueError, TypeError):
                errors.append({'item': idx, 'error': 'Price, Stock, or Category ID must be valid numbers.'})
                continue

            if Product.query.filter_by(name=name).first():
                errors.append({'item': idx, 'error': f'Product name "{name}" already exists'})
                continue

            if not Category.query.get(category_id):
                errors.append({'item': idx, 'error': 'Category not found'})
                continue

            product = Product(
                name=name,
                description=description,
                price=price,
                category_id=category_id,
                image_url=image_url,
                brand=brand,
                stock=stock
            )
            db.session.add(product)
            created.append(product)

        if created:
            db.session.commit()

        return jsonify({
            'message': f'{len(created)} products created',
            'created': [serialize_product(p) for p in created],
            'errors': errors
        }), HTTP_201_CREATED if created else HTTP_400_BAD_REQUEST

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error batch uploading products: {e}", exc_info=True)
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Get products with pagination & filtering (public)
@product.route('/', methods=['GET'])
def get_products():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '').strip()
        category_filter = request.args.get('category_id')

        query = Product.query.join(Category, isouter=True)

        if search:
            query = query.filter(
                db.or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.brand.ilike(f'%{search}%'),
                    Category.name.ilike(f'%{search}%')
                )
            )

        if category_filter:
            try:
                category_filter = int(category_filter)
                query = query.filter(Product.category_id == category_filter)
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid category_id filter.'}), HTTP_400_BAD_REQUEST


        paginated = query.order_by(Product.date_created.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        products = paginated.items

        return jsonify({
            'message': 'Products retrieved successfully',
            'total': paginated.total,
            'page': paginated.page,
            'pages': paginated.pages,
            'products': [serialize_product(p) for p in products]
        }), HTTP_200_OK

    except Exception as e:
        current_app.logger.error(f"Error getting products: {e}", exc_info=True)
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# Get product by ID with category info
@product.route('/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = Product.query.get_or_404(id)
        return jsonify(serialize_product(product)), HTTP_200_OK
    except Exception as e:
        current_app.logger.error(f"Error getting product {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# Update product (admin only)
@product.route('/<int:id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_product(id):
    try:
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.user_type not in ['admin', 'super_admin']:
            return jsonify({'error': 'Only admins can update products'}), HTTP_403_FORBIDDEN

        product = Product.query.get_or_404(id)
        data = request.get_json()

        if 'name' in data and data['name'] != product.name:
            if Product.query.filter_by(name=data['name']).first():
                return jsonify({'error': 'Product name already exists'}), HTTP_409_CONFLICT
            product.name = data['name']

        # Handle optional fields based on nullable status in your model
        # image_url is nullable=False, so convert empty string or None to empty string
        if 'image_url' in data:
            product.image_url = data['image_url'] if data['image_url'] != '' else ''
            if data['image_url'] is None:
                product.image_url = ''

        # description and brand are nullable=True, so convert empty string to None
        if 'description' in data:
            # FIX: Corrected typo from data['get'] to data.get
            product.description = data.get('description') if data.get('description') != '' else None
        if 'brand' in data:
            product.brand = data.get('brand') if data.get('brand') != '' else None # FIX: Also use .get() for consistency

        # Update price and stock, ensuring they are numbers
        if 'price' in data:
            try:
                product.price = float(data['price'])
            except (ValueError, TypeError):
                return jsonify({'error': 'Price must be a valid number.'}), HTTP_400_BAD_REQUEST
        
        if 'stock' in data:
            try:
                product.stock = int(data['stock'])
            except (ValueError, TypeError):
                return jsonify({'error': 'Stock must be a valid integer.'}), HTTP_400_BAD_REQUEST


        # Handle category_id update
        if 'category_id' in data:
            category_id = data['category_id']
            try:
                category_id = int(category_id)
            except (ValueError, TypeError):
                return jsonify({'error': 'Category ID must be a valid integer.'}), HTTP_400_BAD_REQUEST

            if not Category.query.get(category_id):
                return jsonify({'error': 'Category not found'}), HTTP_404_NOT_FOUND
            product.category_id = category_id

        db.session.commit()

        return jsonify({'message': 'Product updated successfully', 'product': serialize_product(product)}), HTTP_200_OK

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating product {id}: {e}", exc_info=True)
        return jsonify({'error': 'An internal server error occurred.'}), HTTP_500_INTERNAL_SERVER_ERROR

# Delete product (admin only)
@product.route('delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    try:
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.user_type not in ['admin', 'super_admin']:
            return jsonify({'error': 'Only admins can delete products'}), HTTP_403_FORBIDDEN

        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), HTTP_200_OK

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting product {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


@product.route('/test', methods=['GET'])
def test_api():
    return jsonify({"message": "Backend is working!"})
