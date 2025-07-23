from app import create_app, db
from app.models import User, MealOption, Order

app = create_app()

with app.app_context():
    # Clear existing data in the correct order
    Order.query.delete()
    MealOption.query.delete()
    User.query.delete()
    
    # Create a default caterer
    caterer = User(
        username='caterer',
        email='caterer@mealy.com',
        is_admin=True,
        name='Mealy Head Chef'
    )
    caterer.password_hash = 'password'
    db.session.add(caterer)
    db.session.commit()

    # Delete 'Vegetarian Pasta Primavera' if it exists
    meal_to_delete = MealOption.query.filter_by(name='Vegetarian Pasta Primavera').first()
    if meal_to_delete:
        db.session.delete(meal_to_delete)
        db.session.commit()
        print("Deleted 'Vegetarian Pasta Primavera' from the database.")

    meals = [
        MealOption(
            name='Grilled Salmon with Asparagus',
            description='A healthy and delicious meal of grilled salmon served with a side of fresh asparagus.',
            price=15.99,
            image_url='https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
            sides=['Lemon wedge', 'Dill sauce'],
            caterer_id=caterer.id
        ),
        MealOption(
            name='Classic Beef Burger',
            description='A juicy beef patty on a sesame seed bun, with lettuce, tomato, and our special sauce.',
            price=12.50,
            image_url='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
            sides=['French fries', 'Ketchup', 'Mustard'],
            caterer_id=caterer.id
        ),
        MealOption(
            name='Vegetarian Pasta Primavera',
            description='A delightful mix of fresh spring vegetables and pasta in a light cream sauce.',
            price=14.00,
            image_url='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
            sides=['Garlic bread', 'Parmesan cheese'],
            caterer_id=caterer.id
        ),
        MealOption(
            name='Spicy Chicken Tacos',
            description='Three soft shell tacos filled with spicy grilled chicken, pico de gallo, and cilantro.',
            price=11.75,
            image_url='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
            sides=['Sour cream', 'Guacamole', 'Lime wedge'],
            caterer_id=caterer.id
        ),
        MealOption(
            name='Margherita Pizza',
            description='A classic pizza with fresh tomatoes, mozzarella, basil, and a drizzle of olive oil.',
            price=13.25,
            image_url='https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80',
            sides=['Red pepper flakes', 'Oregano'],
            caterer_id=caterer.id
        )
    ]

    db.session.bulk_save_objects(meals)
    db.session.commit()

    # Reset password for users 'quiver' and 'claire' if they exist
    for username in ['quiver', 'claire']:
        user = User.query.filter_by(username=username).first()
        if user:
            user.password_hash = 'password123'
            print(f"Reset password for {username}")
    db.session.commit()

    print("Database seeded with a default caterer and 5 meals!")
