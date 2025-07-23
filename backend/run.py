from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)

@app.shell_context_processor
def make_shell_context():
    from app import models
    return dict(db=db, User=models.User, MealOption=models.MealOption, Menu=models.Menu, Order=models.Order)

if __name__ == '__main__':
    app.run(debug=True) 