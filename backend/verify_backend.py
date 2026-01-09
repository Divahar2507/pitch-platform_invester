import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"
SEPARATOR = "-" * 60

def print_section(title):
    print(f"\n{SEPARATOR}")
    print(f"Testing: {title}")
    print(SEPARATOR)

def test_root():
    print_section("Root Endpoint")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("SUCCESS: Root endpoint is accessible.")
            print(f"Response: {response.json()}")
        else:
            print(f"FAILURE: Root endpoint returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Could not connect to backend. Is it running? {e}")
        sys.exit(1)

def login_user(email, password, role_name):
    print_section(f"Login as {role_name}")
    try:
        payload = {"email": email, "password": password}
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            token = response.json().get("access_token")
            print(f"SUCCESS: Login successful for {email}")
            return token
        else:
            print(f"FAILURE: Login failed for {email}. Status: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        print(f"ERROR: Login request failed: {e}")
        return None

def test_startup_profile(token):
    print_section("Create/Get Startup Profile")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Get Profile (might fail if not created yet)
    print("Fetching existing profile...")
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers) 
    
    profile_data = {
        "company_name": "Test Startup Auto",
        "industry": "Software",
        "funding_stage": "Pre-Seed",
        "vision": "Automated testing",
        "problem": "Manual testing is boring",
        "solution": "Python scripts",
        "description": "A description from the test script.",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600001",
        "contact_address": "123 Test St",
        "mobile": "9999999999"
    }
    
    print("Attempting to create profile...")
    response = requests.post(f"{BASE_URL}/startup/profile", json=profile_data, headers=headers)
    
    startup_id = None
    
    if response.status_code == 200:
        print("SUCCESS: Startup profile created.")
        startup_id = response.json().get("id")
    elif response.status_code == 400 and "already exists" in response.text:
        print("INFO: Startup profile already exists.")
    else:
        print(f"FAILURE: Create profile returned {response.status_code}: {response.text}")

    return startup_id

def test_pitch_feed(token):
    print_section("Pitch Feed (Investor View)")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test default
    print("Fetching feed (default)...")
    response = requests.get(f"{BASE_URL}/pitches/feed", headers=headers)
    if response.status_code == 200:
        pitches = response.json()
        print(f"SUCCESS: Feed returned {len(pitches)} pitches.")
        if len(pitches) > 0:
            print(f"Sample Pitch: {pitches[0]['title']} by {pitches[0].get('company_name', 'Unknown')}")
    else:
        print(f"FAILURE: Feed returned {response.status_code}: {response.text}")

    # Test Pagination
    print("Fetching feed with limit=5...")
    response = requests.get(f"{BASE_URL}/pitches/feed?limit=5&skip=0", headers=headers)
    if response.status_code == 200:
        pitches = response.json()
        print(f"SUCCESS: Limited feed returned {len(pitches)} pitches.")
        assert len(pitches) <= 5
    else:
        print(f"FAILURE: Limited feed returned {response.status_code}: {response.text}")

def test_matching(token, startup_id):
    print_section("Matching")
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"Fetching matches for startup ID: {startup_id}")
    response = requests.get(f"{BASE_URL}/matches/startup/{startup_id}", headers=headers)
    
    if response.status_code == 200:
        matches = response.json()
        print(f"SUCCESS: Found {len(matches)} matches.")
        if len(matches) > 0:
            print(f"Top Match: Investor {matches[0].get('investor_name')} with Score {matches[0].get('match_score')}")
    else:
        print(f"FAILURE: Matching returned {response.status_code}: {response.text}")

def test_messaging(token, user_id, other_user_id):
    print_section("Messaging")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Send Message
    print(f"Sending message to User {other_user_id}...")
    msg_data = {
        "receiver_id": other_user_id,
        "content": "Hello from automated test script!"
    }
    response = requests.post(f"{BASE_URL}/messages/send", json=msg_data, headers=headers)
    
    if response.status_code == 200:
        print("SUCCESS: Message sent.")
    else:
        print(f"FAILURE: Send message returned {response.status_code}: {response.text}")
        
    # 2. Get Messages
    print("Fetching messages...")
    response = requests.get(f"{BASE_URL}/messages/{user_id}", headers=headers)
    
    if response.status_code == 200:
        msgs = response.json()
        print(f"SUCCESS: Retrieved {len(msgs)} messages.")
    else:
        print(f"FAILURE: Get messages returned {response.status_code}: {response.text}")

def test_notifications(token):
    print_section("Notifications")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/notifications/", headers=headers)
    
    if response.status_code == 200:
        notifs = response.json()
        print(f"SUCCESS: Retrieved {len(notifs)} notifications.")
    else:
        print(f"FAILURE: Get notifications returned {response.status_code}: {response.text}")


def get_me(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if response.status_code == 200:
        return response.json()
    return None

def main():
    test_root()
    
    # 1. Login as Startup
    startup_email = "techflow@example.com"
    startup_pass = "password"
    startup_token = login_user(startup_email, startup_pass, "Startup")
    
    startup_user = None
    if startup_token:
        startup_user = get_me(startup_token)
        if startup_user:
            print(f"Startup User ID: {startup_user['id']}")

    # 2. Login as Investor
    investor_email = "investor_jane@example.com"
    investor_pass = "password"
    investor_token = login_user(investor_email, investor_pass, "Investor")
    
    investor_user = None
    if investor_token:
        investor_user = get_me(investor_token)
        if investor_user:
            print(f"Investor User ID: {investor_user['id']}")
        
        test_pitch_feed(investor_token)
        test_notifications(investor_token)
        
    if startup_token and startup_user and investor_user:
        # Assuming StartupProfile ID 1 belongs to TechFlow
        test_matching(startup_token, 1)
        test_messaging(startup_token, startup_user['id'], investor_user['id'])

if __name__ == "__main__":
    main()
