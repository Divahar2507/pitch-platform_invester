import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def check_endpoint(url, name):
    print(f"Checking {name} ({url})...")
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"Success! returned {len(data)} items.")
                if len(data) > 0:
                    print(f"Sample: {str(data[0])[:100]}...")
            else:
                print(f"Success! Response: {str(data)[:100]}...")
        else:
            print(f"Failed. Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

print("--- PUBLIC API CHECK ---")
check_endpoint(f"{BASE_URL}/investors/", "Investors List (Public)")
check_endpoint(f"{BASE_URL}/pitches/feed", "Pitch Feed (Public)")
print("------------------------")
