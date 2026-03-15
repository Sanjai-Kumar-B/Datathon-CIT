import requests
import json

url = "http://127.0.0.1:8000/api/teacher-assistant"
payload = {
    "question": "How to teach reading?",
    "child_age": 5,
    "language": "en"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Request failed: {e}")
