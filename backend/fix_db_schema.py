from app.database import engine
from sqlalchemy import text

def add_missing_columns():
    with engine.connect() as conn:
        try:
            print("Checking Pitch table schema...")
            # Add raising_amount column if it doesn't exist
            conn.execute(text("ALTER TABLE pitches ADD COLUMN IF NOT EXISTS raising_amount VARCHAR;"))
            conn.execute(text("ALTER TABLE pitches ADD COLUMN IF NOT EXISTS equity_percentage VARCHAR;"))
            conn.commit()
            print("Successfully added missing columns (if they didn't exist).")
        except Exception as e:
            print(f"Error altering table: {e}")

if __name__ == "__main__":
    add_missing_columns()
