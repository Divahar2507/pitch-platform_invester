from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.core import StartupProfile, Pitch

def create_defaults():
    db = SessionLocal()
    try:
        print("Checking for startups without pitches...")
        startups = db.query(StartupProfile).all()
        count = 0
        for s in startups:
            # Check for existing pitch
            existing = db.query(Pitch).filter(Pitch.startup_id == s.id).first()
            if not existing:
                description = s.description or s.vision or "No description provided."
                
                pitch = Pitch(
                    startup_id=s.id,
                    title=f"{s.company_name} Opportunity",
                    description=description,
                    raising_amount="Undisclosed",
                    equity_percentage="Negotiable",
                    status="published", # So it shows in feed
                    pitch_file_url=""
                )
                db.add(pitch)
                count += 1
                
                if count % 100 == 0:
                    print(f"Created {count} pitches...")
                    # db.commit() # Commit periodically to avoid huge transaction
        
        db.commit()
        print(f"Finished. Created {count} default pitches.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_defaults()
