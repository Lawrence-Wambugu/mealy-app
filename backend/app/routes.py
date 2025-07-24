
from flask import request, make_response
from flask_restful import Resource
from .models import User, MealOption, Menu, Order
from . import db, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json

class MarkOrderDelivered(Resource):
    @jwt_required()
    def post(self, order_id):
        return self._mark_delivered(order_id)

    @jwt_required()
    def put(self, order_id):
        return self._mark_delivered(order_id)

    def _mark_delivered(self, order_id):
        current_user = json.loads(get_jwt_identity())
        user = User.query.filter_by(username=current_user['username']).first()
        if not user or not user.is_admin:
            resp = make_response({'message': 'Admin access required'}, 403)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp
        order = Order.query.get_or_404(order_id)
        order.is_delivered = True
        db.session.commit()
        resp = make_response({'message': 'Order marked as delivered', 'order_id': order_id}, 200)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class CustomerOrders(Resource):
    @jwt_required()
    def get(self):
        identity = json.loads(get_jwt_identity())
        user = User.query.filter_by(username=identity['username']).first()
        if not user:
            resp = make_response({'message': 'User not found'}, 404)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp
        # Show all orders, not just undelivered
        orders = Order.query.filter_by(user_id=user.id).order_by(Order.id.desc()).all()
        result = [
            {
                'id': order.id,
                'meal': order.meal_option.name,
                'image_url': order.meal_option.image_url,  # Add image_url here
                'delivery_date': order.delivery_date.isoformat(),
                'delivery_address': order.delivery_address,
                'is_delivered': order.is_delivered,
                'created_at': order.created_at.isoformat() if order.created_at else None
            }
            for order in orders
        ]
        resp = make_response(result, 200)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        username = data.get('username')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        is_admin = data.get('is_admin', False)

        # Auto-fill missing fields
        missing_fields = []
        if not username:
            username = f"user{User.query.count()+1}"
            missing_fields.append('username (auto-filled)')
        if not email:
            email = f"user{User.query.count()+1}@example.com"
            missing_fields.append('email (auto-filled)')
        if not password:
            password = 'defaultpassword123'
            missing_fields.append('password (auto-filled)')
        if not name:
            name = f"User{User.query.count()+1}"
            missing_fields.append('name (auto-filled)')
        if not phone:
            phone = '0700000000'
            missing_fields.append('phone (auto-filled)')

        # Check for existing username/email
        if User.query.filter_by(username=username).first():
            resp = make_response({'message': 'Username already exists', 'username': username}, 400)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp
        if User.query.filter_by(email=email).first():
            resp = make_response({'message': 'Email already exists', 'email': email}, 400)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp

        # Hash password
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(
            name=name,
            username=username,
            email=email,
            phone=phone,
            is_admin=is_admin
        )
        # Use password_hash setter to hash and store password
        user.password_hash = password
        db.session.add(user)
        db.session.commit()

        resp = make_response({'message': 'User created successfully', 'missing_fields': missing_fields}, 201)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        # Use check_password if available, else compare hash
        valid = False
        if user:
            if hasattr(user, 'check_password'):
                valid = user.check_password(password)
            else:
                valid = bcrypt.check_password_hash(user.password_hash, password)
        if valid:
            # Store identity as JSON string
            access_token = create_access_token(identity=json.dumps({'username': user.username, 'is_admin': user.is_admin}))
            return {'access_token': access_token}, 200

        return {'message': 'Invalid credentials'}, 401

class OrderList(Resource):
    @jwt_required()
    def get(self):
        identity = json.loads(get_jwt_identity())
        user = User.query.filter_by(username=identity['username']).first()

        if not user or not user.is_admin:
            resp = make_response({'message': 'Admin access required'}, 403)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp

        # Only get orders for meals created by the current caterer
        orders = Order.query.join(MealOption).filter(MealOption.caterer_id == user.id).all()
        result = [
            {
                'id': order.id,
                'customer': order.user.username,
                'customer_name': order.user.name,
                'customer_phone': order.phone,
                'delivery_address': order.delivery_address,
                'meal': order.meal_option.name,
                'delivery_date': order.delivery_date.isoformat(),
                'is_delivered': order.is_delivered
            }
            for order in orders
        ]
        resp = make_response(result, 200)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

    @jwt_required()
    def post(self):
        identity = json.loads(get_jwt_identity())
        user = User.query.filter_by(username=identity['username']).first()
        
        if not user:
            return {'message': 'User not found'}, 404
            
        data = request.get_json()
        meal_id = data.get('meal_id')
        delivery_date = data.get('delivery_date')
        delivery_address = data.get('delivery_address')
        phone = data.get('phone')

        missing_order_fields = []
        if not meal_id:
            return make_response({'message': 'Missing meal_id', 'data': data}, 422)
        if not delivery_date:
            delivery_date = '2025-07-23'
            missing_order_fields.append('delivery_date (auto-filled)')
        if not delivery_address:
            delivery_address = 'Default Address'
            missing_order_fields.append('delivery_address (auto-filled)')
        if not phone:
            phone = '0700000000'
            missing_order_fields.append('phone (auto-filled)')
        if missing_order_fields:
            resp = make_response({'message': f"Missing order fields: {', '.join(missing_order_fields)} (auto-filled)", 'data': data}, 200)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp

        new_order = Order(
            user_id=user.id,
            meal_option_id=meal_id,
            delivery_date=delivery_date,
            delivery_address=delivery_address,
            phone=phone
        )
        
        db.session.add(new_order)
        db.session.commit()
        
        resp = make_response({'message': 'Order created successfully'}, 201)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class HelloWorld(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {'message': f'Hello, {current_user["username"]}!'}

class MealOptionList(Resource):
    @jwt_required(optional=True)  # Changed to optional
    def get(self):
        meals = MealOption.query.all()
        result = [
            {
                'id': meal.id,
                'name': meal.name,
                'description': meal.description,
                'price': meal.price,
                'image_url': meal.image_url,
                'sides': meal.sides
            }
            for meal in meals
        ]
        resp = make_response(result, 200)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

    @jwt_required()
    def post(self):
        try:
            identity = json.loads(get_jwt_identity())
            user = User.query.filter_by(username=identity['username']).first()
            if not user or not user.is_admin:
                return {'message': 'Admin access required'}, 403
            data = request.get_json()
            name = data.get('name')
            description = data.get('description')
            price = data.get('price')
            image_url = data.get('image_url')
            sides = data.get('sides', [])
            if isinstance(sides, list):
                sides = ', '.join(sides)
            if not name:
                name = f"Meal{MealOption.query.count()+1}"
            if not price:
                price = 10.0
            resp = None
            if not name or not price:
                resp = make_response({'message': 'Missing name or price (auto-filled)', 'data': data}, 200)
                resp.headers['Access-Control-Allow-Origin'] = '*'
                return resp
            meal = MealOption(
                name=name,
                description=description,
                price=price,
                image_url=image_url,
                sides=sides,
                caterer_id=user.id # Associate with current caterer
            )
            db.session.add(meal)
            db.session.commit()
            resp = make_response({'id': meal.id, 'name': meal.name}, 201)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp
        except Exception as e:
            import traceback
            traceback.print_exc()
            return {'error': str(e)}, 500

class MealOptionDetail(Resource):
    @jwt_required()
    def put(self, meal_id):
        identity = json.loads(get_jwt_identity())
        if not identity['is_admin']:
            return {'message': 'Admin access required'}, 403

        meal = MealOption.query.get_or_404(meal_id)
        data = request.get_json()
        updated_fields = {}
        if 'name' in data:
            meal.name = data['name']
            updated_fields['name'] = data['name']
        if 'description' in data:
            meal.description = data['description']
            updated_fields['description'] = data['description']
        if 'price' in data:
            meal.price = data['price']
            updated_fields['price'] = data['price']
        db.session.commit()
        return {'message': 'Meal option updated successfully', 'updated_fields': updated_fields}

    @jwt_required()
    def delete(self, meal_id):
        identity = json.loads(get_jwt_identity())
        if not identity['is_admin']:
            return {'message': 'Admin access required'}, 403

        meal = MealOption.query.get_or_404(meal_id)
        db.session.delete(meal)
        db.session.commit()

        return {'message': 'Meal option deleted successfully'}

class CatererMeals(Resource):
    @jwt_required()
    def get(self):
        identity = json.loads(get_jwt_identity())
        user = User.query.filter_by(username=identity['username']).first()
        if not user or not user.is_admin:
            return {'message': 'Admin access required'}, 403
        meals = MealOption.query.filter_by(caterer_id=user.id).all()
        result = [
            {
                'id': meal.id,
                'name': meal.name,
                'description': meal.description,
                'price': meal.price,
                'image_url': meal.image_url,
                'sides': meal.sides
            }
            for meal in meals
        ]
        return result, 200

def initialize_routes(api):
    # Utility endpoint for deleting specific meals by name (for admin use only)
    class DeleteMealsByName(Resource):
        @jwt_required()
        def post(self):
            current_user = get_jwt_identity()
            user = User.query.filter_by(username=current_user['username']).first()
            if not user or not user.is_admin:
                return {'message': 'Admin access required'}, 403
            names = request.json.get('names', [])
            deleted = []
            for meal in MealOption.query.filter(MealOption.name.in_(names)).all():
                deleted.append(meal.name)
                db.session.delete(meal)
            db.session.commit()
            return {'message': f"Deleted meals: {', '.join(deleted)}"}

    api.add_resource(DeleteMealsByName, '/meals/delete_by_name')
    # Utility endpoint for updating image_url of a meal by name (for admin use only)
    class UpdateMealImage(Resource):
        @jwt_required()
        def post(self):
            current_user = get_jwt_identity()
            user = User.query.filter_by(username=current_user['username']).first()
            if not user or not user.is_admin:
                resp = make_response({'message': 'Admin access required'}, 403)
                resp.headers['Access-Control-Allow-Origin'] = '*'
                return resp
            data = request.get_json(force=True)
            meal_name = data.get('meal_name')
            new_image_url = data.get('image_url')
            if not meal_name or not new_image_url:
                resp = make_response({'message': 'meal_name and image_url are required'}, 422)
                resp.headers['Access-Control-Allow-Origin'] = '*'
                return resp
            meal = MealOption.query.filter_by(name=meal_name).first()
            if not meal:
                resp = make_response({'message': f'Meal "{meal_name}" not found'}, 404)
                resp.headers['Access-Control-Allow-Origin'] = '*'
                return resp
            meal.image_url = new_image_url
            db.session.commit()
            resp = make_response({'message': f'Image URL for "{meal_name}" updated successfully'}, 200)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp
    
    api.add_resource(UpdateMealImage, '/meals/update_image')
    api.add_resource(MarkOrderDelivered, '/orders/<int:order_id>/delivered')
    api.add_resource(CustomerOrders, '/orders/customer')
    api.add_resource(UserRegistration, '/register')
    api.add_resource(UserLogin, '/login')
    api.add_resource(OrderList, '/orders') # New endpoint
    api.add_resource(HelloWorld, '/hello')
    api.add_resource(MealOptionList, '/meals')
    api.add_resource(MealOptionDetail, '/meals/<int:meal_id>') 
    api.add_resource(CatererMeals, '/meals/mine') 