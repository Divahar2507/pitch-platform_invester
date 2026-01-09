from sqlalchemy import create_engine, text
import os

# Database URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Diva%402004@localhost:5432/pitch_platform")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def run_migration():
    with engine.connect() as connection:
        # List of columns to add
        columns = [
            ("description", "TEXT"),
            ("city", "VARCHAR(255)"),
            ("state", "VARCHAR(255)"),
            ("pincode", "VARCHAR(20)"),
            ("contact_address", "TEXT"),
            ("mobile", "VARCHAR(50)"),
            ("email_verified", "BOOLEAN DEFAULT FALSE"),
            ("mobile_verified", "BOOLEAN DEFAULT FALSE")
        ]

        for col_name, col_type in columns:
            try:
                # Check if column exists first (postgres specific query)
                check_query = text(f"SELECT column_name FROM information_schema.columns WHERE table_name='startup_profiles' AND column_name='{col_name}';")
                result = connection.execute(check_query).fetchone()
                
                if not result:
                    print(f"Adding column {col_name}...")
                    alter_query = text(f"ALTER TABLE startup_profiles ADD COLUMN {col_name} {col_type};")
                    connection.execute(alter_query)
                    print(f"Added column {col_name}.")
                else:
                    print(f"Column {col_name} already exists.")
            except Exception as e:
                print(f"Error checking/adding column {col_name}: {e}")
        
        connection.commit()
        print("Migration complete.")

if __name__ == "__main__":
    run_migration()
