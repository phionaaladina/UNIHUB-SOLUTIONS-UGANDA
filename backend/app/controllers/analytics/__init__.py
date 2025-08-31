# Add this to your Flask backend - create a new file: routes/analytics.py

from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.models.product import Product
from app.models.user import User
from app.models.sale import Sale
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt
from app.status_codes import (
    HTTP_200_OK, HTTP_403_FORBIDDEN, HTTP_500_INTERNAL_SERVER_ERROR
)

# Define the analytics blueprint
analytics = Blueprint('analytics', __name__, url_prefix='/api/v1/analytics')

def is_admin_or_superadmin():
    """Helper function to check if the current user has admin or super_admin role."""
    claims = get_jwt()
    return claims.get('user_type') in ['admin', 'super_admin']

@analytics.route('/overview', methods=['GET'])
@jwt_required()
def get_overview():
    """Get overview statistics for dashboard"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        # Get time range parameter (default: 30 days)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Total revenue from all completed orders
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.status == 'delivered'
        ).scalar() or 0
        
        # Revenue for the specified period
        period_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            and_(Order.status == 'delivered', Order.created_at >= start_date)
        ).scalar() or 0
        
        # Total orders
        total_orders = Order.query.count()
        
        # Orders in the specified period
        period_orders = Order.query.filter(Order.created_at >= start_date).count()
        
        # Total products
        total_products = Product.query.count()
        
        # Total customers (registered users + unique guest emails)
        registered_customers = User.query.filter(User.user_type == 'customer').count()
        guest_customers = db.session.query(func.count(func.distinct(Order.customer_email))).filter(
            Order.user_id.is_(None)
        ).scalar() or 0
        total_customers = registered_customers + guest_customers
        
        # Pending orders
        pending_orders = Order.query.filter(Order.status == 'pending').count()
        
        # Low stock products (stock < 10)
        low_stock_products = Product.query.filter(Product.stock < 10).count()
        
        # Processing orders
        processing_orders = Order.query.filter(Order.status == 'processing').count()
        
        # Shipped orders
        shipped_orders = Order.query.filter(Order.status == 'shipped').count()
        
        return jsonify({
            'total_revenue': float(total_revenue),
            'period_revenue': float(period_revenue),
            'total_orders': total_orders,
            'period_orders': period_orders,
            'total_products': total_products,
            'total_customers': total_customers,
            'pending_orders': pending_orders,
            'processing_orders': processing_orders,
            'shipped_orders': shipped_orders,
            'low_stock_products': low_stock_products
        }), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching overview data: {e}")
        return jsonify({'error': 'Failed to fetch overview data'}), HTTP_500_INTERNAL_SERVER_ERROR

@analytics.route('/sales-trend', methods=['GET'])
@jwt_required()
def get_sales_trend():
    """Get sales trend data for charts"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Daily sales for the period
        daily_sales = db.session.query(
            func.date(Order.created_at).label('date'),
            func.sum(Order.total_amount).label('total'),
            func.count(Order.order_id).label('orders')
        ).filter(
            and_(Order.created_at >= start_date, Order.status == 'delivered')
        ).group_by(func.date(Order.created_at)).order_by('date').all()
        
        sales_data = [
            {
                'date': sale.date.strftime('%Y-%m-%d'),
                'revenue': float(sale.total or 0),
                'orders': sale.orders
            }
            for sale in daily_sales
        ]
        
        return jsonify(sales_data), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching sales trend: {e}")
        return jsonify({'error': 'Failed to fetch sales trend'}), HTTP_500_INTERNAL_SERVER_ERROR

@analytics.route('/orders-by-status', methods=['GET'])
@jwt_required()
def get_orders_by_status():
    """Get order distribution by status"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        orders_by_status = db.session.query(
            Order.status,
            func.count(Order.order_id).label('count')
        ).group_by(Order.status).all()
        
        status_data = [
            {
                'status': order.status,
                'count': order.count,
                'percentage': 0  # Will be calculated on frontend
            }
            for order in orders_by_status
        ]
        
        # Calculate percentages
        total = sum(item['count'] for item in status_data)
        for item in status_data:
            item['percentage'] = round((item['count'] / total * 100), 2) if total > 0 else 0
        
        return jsonify(status_data), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching orders by status: {e}")
        return jsonify({'error': 'Failed to fetch orders by status'}), HTTP_500_INTERNAL_SERVER_ERROR

@analytics.route('/top-products', methods=['GET'])
@jwt_required()
def get_top_products():
    """Get top selling products"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        limit = request.args.get('limit', 10, type=int)
        
        top_products = db.session.query(
            Product.name,
            Product.price,
            Product.stock,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.quantity * OrderItem.price).label('total_revenue')
        ).join(OrderItem).join(Order).filter(
            Order.status == 'delivered'
        ).group_by(Product.id).order_by(desc('total_sold')).limit(limit).all()
        
        products_data = [
            {
                'name': product.name,
                'price': float(product.price),
                'stock': product.stock,
                'sold': product.total_sold,
                'revenue': float(product.total_revenue or 0)
            }
            for product in top_products
        ]
        
        return jsonify(products_data), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching top products: {e}")
        return jsonify({'error': 'Failed to fetch top products'}), HTTP_500_INTERNAL_SERVER_ERROR

@analytics.route('/recent-orders', methods=['GET'])
@jwt_required()
def get_recent_orders():
    """Get recent orders for dashboard"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        limit = request.args.get('limit', 10, type=int)
        
        recent_orders = db.session.query(Order).order_by(desc(Order.created_at)).limit(limit).all()
        
        orders_data = []
        for order in recent_orders:
            user = User.query.get(order.user_id) if order.user_id else None
            orders_data.append({
                'id': order.order_id,
                'customer': f"{user.first_name} {user.last_name}" if user else order.customer_name,
                'email': user.email if user else order.customer_email,
                'total': float(order.total_amount),
                'status': order.status,
                'created_at': order.created_at.isoformat()
            })
        
        return jsonify(orders_data), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching recent orders: {e}")
        return jsonify({'error': 'Failed to fetch recent orders'}), HTTP_500_INTERNAL_SERVER_ERROR

@analytics.route('/monthly-revenue', methods=['GET'])
@jwt_required()
def get_monthly_revenue():
    """Get monthly revenue for the past year"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        # Get revenue for the past 12 months
        one_year_ago = datetime.utcnow() - timedelta(days=365)
        
        monthly_revenue = db.session.query(
            func.extract('year', Order.created_at).label('year'),
            func.extract('month', Order.created_at).label('month'),
            func.sum(Order.total_amount).label('revenue')
        ).filter(
            and_(Order.created_at >= one_year_ago, Order.status == 'delivered')
        ).group_by(
            func.extract('year', Order.created_at),
            func.extract('month', Order.created_at)
        ).order_by('year', 'month').all()
        
        revenue_data = [
            {
                'month': f"{int(rev.year)}-{int(rev.month):02d}",
                'revenue': float(rev.revenue or 0)
            }
            for rev in monthly_revenue
        ]
        
        return jsonify(revenue_data), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching monthly revenue: {e}")
        return jsonify({'error': 'Failed to fetch monthly revenue'}), HTTP_500_INTERNAL_SERVER_ERROR

@analytics.route('/low-stock-products', methods=['GET'])
@jwt_required()
def get_low_stock_products():
    """Get products with low stock"""
    if not is_admin_or_superadmin():
        return jsonify({'error': 'Admin or Superadmin access required'}), HTTP_403_FORBIDDEN
    
    try:
        threshold = request.args.get('threshold', 10, type=int)
        
        low_stock = Product.query.filter(Product.stock <= threshold).order_by(Product.stock).all()
        
        products_data = [
            {
                'id': product.id,
                'name': product.name,
                'stock': product.stock,
                'price': float(product.price),
                'status': 'Critical' if product.stock == 0 else 'Low'
            }
            for product in low_stock
        ]
        
        return jsonify(products_data), HTTP_200_OK
        
    except Exception as e:
        current_app.logger.error(f"Error fetching low stock products: {e}")
        return jsonify({'error': 'Failed to fetch low stock products'}), HTTP_500_INTERNAL_SERVER_ERROR