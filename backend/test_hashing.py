from app.utils.security import get_password_hash

try:
    print("Testing hash...")
    pw = "password123"
    hashed = get_password_hash(pw)
    print(f"Success. Hash length: {len(hashed)}")
    print(hashed)
except Exception as e:
    print("Hashing failed:")
    print(e)
    import traceback
    traceback.print_exc()
