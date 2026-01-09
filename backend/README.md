# Startup-Investor Pitch Platform Backend

This is a FastAPI-based backend for a platform connecting startups with investors.

## 🚀 Features

- **Authentication**: JWT-based auth with role management (Startup/Investor).
- **Profiles**: Create and manage startup and investor profiles.
- **Pitch Decks**: Upload PDF pitch decks.
- **Matching**: Deterministic algorithm to match startups with potential investors.
- **Messaging**: Simple messaging system between users.

## 🛠 Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs.
- **PostgreSQL**: Robust relational database.
- **SQLAlchemy**: ORM for database interactions.
- **Pydantic**: Data validation.

## 🏃‍♂️ How to Run

### Prerequisites

- Python 3.9+
- PostgreSQL installed and running locally.
- Create a database named `pitch_platform` (or update `DATABASE_URL` in `.env` or `app/database.py`). Note: The code defaults to `pitch_platform` with user `postgres` and password `Diva@2004`.

### Setup

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```

2.  **Create virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate virtual environment:**
    - Windows:
      ```bash
      venv\Scripts\activate
      ```
    - Mac/Linux:
      ```bash
      source venv/bin/activate
      ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the server:**
    ```bash
    uvicorn app.main:app --reload
    ```

6.  **Access API:**
    - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
    - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🧪 Seed Data

On the first run, the application will automatically populate the database with:

- **Investor**: `investor@test.com` / `password`
- **Startup**: `startup@test.com` / `password`

## 📡 API Endpoints Overview

- **Auth**: `/auth/register`, `/auth/login`
- **Startup**: `/startup/profile`, `/startup/profile/{id}`
- **Investor**: `/investors`, `/investors/{id}`
- **Pitches**: `/pitches` (Create), `/pitches/upload` (Upload PDF), `/pitches/my`
- **Matching**: `/matches/startup/{startup_id}`
- **Messaging**: `/messages/send`, `/messages/{user_id}`

## 📝 Notes

- Pitch decks are stored in the `backend/uploads/` directory.
- The matching algorithm boosts scores based on Industry match (+50), Funding Stage match (+30), and a random factor (+0-20).
