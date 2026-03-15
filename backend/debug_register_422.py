import requests
import json

url = "http://127.0.0.1:8000/api/auth/register"

# Simulating the payload from Register.jsx
payload = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "school": "",
    "childName": "",
    "childAge": "",
    "role": "teacher",
    "child_name": "",
    "child_age": None
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    with open("result.json", "w") as f:
        json.dump(response.json(), f, indent=2)
    print("Response saved to result.json")
except Exception as e:
    print(f"Error: {e}")
