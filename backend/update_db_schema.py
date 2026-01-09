from app.database import engine
from sqlalchemy import text

def update_schema():
    with engine.connect() as connection:
        # Startup Columns
        try:
            connection.execute(text("ALTER TABLE startup_profiles ADD COLUMN founder_name VARCHAR;"))
            print("Added founder_name")
        except Exception as e:
            print(f"Skipping founder_name: {e}")

        try:
            connection.execute(text("ALTER TABLE startup_profiles ADD COLUMN founder_bio TEXT;"))
            print("Added founder_bio")
        except Exception as e:
            print(f"Skipping founder_bio: {e}")

        try:
            connection.execute(text("ALTER TABLE startup_profiles ADD COLUMN founder_linkedin VARCHAR;"))
            print("Added founder_linkedin")
        except Exception as e:
             print(f"Skipping founder_linkedin: {e}")

        try:
            connection.execute(text("ALTER TABLE startup_profiles ADD COLUMN resume_url VARCHAR;"))
            print("Added resume_url")
        except Exception as e:
             print(f"Skipping resume_url: {e}")
             
        try:
            connection.execute(text("ALTER TABLE startup_profiles ADD COLUMN website_url VARCHAR;"))
            print("Added website_url (Startup)")
        except Exception as e:
             print(f"Skipping website_url: {e}")

        # Investor Columns
        try:
            connection.execute(text("ALTER TABLE investor_profiles ADD COLUMN contact_name VARCHAR;"))
            print("Added contact_name")
        except Exception as e:
             print(f"Skipping contact_name: {e}")

        try:
            connection.execute(text("ALTER TABLE investor_profiles ADD COLUMN bio TEXT;"))
            print("Added bio")
        except Exception as e:
             print(f"Skipping bio: {e}")
             
        try:
            connection.execute(text("ALTER TABLE investor_profiles ADD COLUMN website_url VARCHAR;"))
            print("Added website_url (Investor)")
        except Exception as e:
             print(f"Skipping website_url: {e}")
             
        try:
            connection.execute(text("ALTER TABLE investor_profiles ADD COLUMN linkedin_url VARCHAR;"))
            print("Added linkedin_url")
        except Exception as e:
             print(f"Skipping linkedin_url: {e}")

        try:
            connection.execute(text("ALTER TABLE investor_profiles ADD COLUMN min_check_size FLOAT;"))
            print("Added min_check_size")
        except Exception as e:
             print(f"Skipping min_check_size: {e}")

        try:
            connection.execute(text("ALTER TABLE investor_profiles ADD COLUMN max_check_size FLOAT;"))
            print("Added max_check_size")
        except Exception as e:
             print(f"Skipping max_check_size: {e}")
             
        connection.commit()
        print("Schema Update Complete.")

if __name__ == "__main__":
    update_schema()
