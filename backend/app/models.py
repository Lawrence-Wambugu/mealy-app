from . import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from datetime import datetime
  
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    _password_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)
    orders = db.relationship('Order', backref='user', lazy=True)

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Cannot view password hash')

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

class MealOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    sides = db.Column(db.String(200))
    caterer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False)
    meal_options = db.relationship('MealOption', secondary='menu_meal_options', lazy='subquery',
                                   backref=db.backref('menus', lazy=True))

menu_meal_options = db.Table('menu_meal_options',
    db.Column('menu_id', db.Integer, db.ForeignKey('menu.id'), primary_key=True),
    db.Column('meal_option_id', db.Integer, db.ForeignKey('meal_option.id'), primary_key=True)
)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menu.id'), nullable=True)
    meal_option_id = db.Column(db.Integer, db.ForeignKey('meal_option.id'), nullable=False)
    delivery_date = db.Column(db.Date, nullable=False)
    delivery_address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    is_delivered = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    menu = db.relationship('Menu', backref=db.backref('orders', lazy=True))
    meal_option = db.relationship('MealOption', backref=db.backref('orders', lazy=True))

class CustomerOrders(Resource):
    @jwt_required()
    def get(self):
        current_user_identity = get_jwt_identity()
        user = User.query.filter_by(username=current_user_identity['username']).first()
        if not user:
            return {'message': 'User not found'}, 404
        orders = Order.query.filter_by(user_id=user.id).all()
        return [
            {
                'id': order.id,
                'meal': order.meal_option.name,
                'image_url': order.meal_option.image_url,
                'delivery_date': order.delivery_date.isoformat(),
                'delivery_address': order.delivery_address,
                'is_delivered': order.is_delivered
            }
            for order in orders
        ]

class OrderDelivered(Resource):
    @jwt_required()
    def put(self, order_id):
        current_user_identity = get_jwt_identity()
        user = User.query.filter_by(username=current_user_identity['username']).first()
        if not user or not user.is_admin:
            return {'message': 'Admin access required'}, 403
        order = Order.query.get(order_id)
        if not order:
            return {'message': 'Order not found'}, 404
        order.is_delivered = True
        db.session.commit()
        return {'message': 'Order marked as delivered'}, 200

def initialize_routes(api):
    api.add_resource(UserRegistration, '/register')
    api.add_resource(UserLogin, '/login')
    api.add_resource(OrderList, '/orders') # New endpoint
    api.add_resource(CustomerOrders, '/orders/customer')
    api.add_resource(OrderDelivered, '/orders/<int:order_id>/delivered')
    api.add_resource(HelloWorld, '/hello')
    api.add_resource(MealOptionList, '/meals')
    api.add_resource(MealOptionDetail, '/meals/<int:meal_id>')
