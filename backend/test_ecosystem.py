import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_publish():
    print("Testing /publish-activity...")
    payload = {
        "teacher_id": "T_TEST_001",
        "student_id": "S_TEST_999",
        "activity_type": "flashcards",
        "content": {
            "topic": "Numbers 1-5",
            "flashcards": [
                {"front": "1", "back": "One", "emoji": "🔢"},
                {"front": "2", "back": "Two", "emoji": "🔢"}
            ]
        }
    }
    response = requests.post(f"{BASE_URL}/publish-activity", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

def test_feed(student_id):
    print(f"\nTesting /student-feed/{student_id}...")
    response = requests.get(f"{BASE_URL}/student-feed/{student_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    try:
        res = test_publish()
        if "student_id" in res:
            test_feed(res["student_id"])
    except Exception as e:
        print(f"Error: {e}")
