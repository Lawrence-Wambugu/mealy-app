# Mealy App

## Project Overview
Mealy is a full-stack web application that connects customers with local caterers, allowing users to browse daily menus, place meal orders, and manage deliveries. Caterers can add, edit, and manage their meal offerings, view and update order statuses, and track their business efficiently.

## Features
- Customer registration, login, and secure authentication
- Browse available meals with images, descriptions, and prices
- Place orders with delivery address and phone number
- View order history and status (pending/delivered)
- Caterer dashboard to add, edit, and manage meals
- Caterer can view only their own meals and orders
- Mark orders as delivered
- Responsive, modern UI for both customers and caterers
- Admin/caterer and customer roles

## Technologies & Frameworks Used
- **Frontend:** React, styled-components, Axios
- **Backend:** Flask, Flask-RESTful, Flask-JWT-Extended, Flask-Migrate, Flask-SQLAlchemy, Flask-Bcrypt, Flask-CORS
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Migrations:** Alembic, Flask-Migrate
- **Deployment:** Render (recommended)

## Team
- **Laetitia Kamangu** (Scrum Master)
- **Lawrence Wambugu** (Backend Developer)
- **Andrew Tobiko** (Frontend Developer)
- **George Mbugua** (Deployment & Documentation)

## Installation

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ & pip (for backend)
- PostgreSQL (for database)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file in the backend directory with:
   ```env
   SECRET_KEY=your-secret-key
   DATABASE_URI=postgresql://<user>:<password>@localhost/<dbname>
   JWT_SECRET_KEY=your-jwt-secret
   ```
5. Initialize the database and run migrations:
   ```bash
   flask db upgrade
   ```
6. (Optional) Seed the database:
   ```bash
   python seed.py
   ```
7. Start the backend server:
   ```bash
   flask run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```

The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000) by default.

## Deployment
- The app is ready for deployment on Render or similar platforms. Ensure environment variables are set and the database is accessible from your deployment environment.

---

For any questions or contributions, please contact the team members listed above. 