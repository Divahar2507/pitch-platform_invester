from app.database import SessionLocal
from app.models.core import User, StartupProfile, Pitch

db = SessionLocal()
u_count = db.query(User).count()
s_count = db.query(StartupProfile).count()
p_count = db.query(Pitch).count()
print(f"Users: {u_count}, Startups: {s_count}, Pitches: {p_count}")
db.close()
