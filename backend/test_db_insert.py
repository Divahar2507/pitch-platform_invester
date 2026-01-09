import sys
import os

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.getcwd())

from app.database import SessionLocal, engine, Base
from app.models.core import User
from app.utils.security import get_password_hash
from sqlalchemy import text

def test_insert():
    db = SessionLocal()
    try:
        # Check if table exists and has 'role' column
        print("Checking User table columns...")
        try:
            # For Postgres, we can query information_schema or just try a raw select
            # But simpler: just try to insert.
            pass
        except Exception as e:
            print(f"Error checking schema: {e}")

        print("Attempting to insert a test user...")
        email = "debug_test_user@example.com"
        
        # Cleanup previous test
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"Deleting existing user {email}")
            db.delete(existing)
            db.commit()

        hashed_password = get_password_hash("password123")
        new_user = User(
            email=email,
            password_hash=hashed_password,
            role="startup"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"Successfully inserted user: {new_user.id} with role: {new_user.role}")
        
    except Exception as e:
        print("Caught exception during insert:")
        print(e)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_insert()
