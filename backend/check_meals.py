from app import create_app, db
from app.models import MealOption

app = create_app()
with app.app_context():
    meals = MealOption.query.all()
    print(f"Number of meals in database: {len(meals)}")
    for meal in meals:
        print(meal.id, meal.name, meal.price) 