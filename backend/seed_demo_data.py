"""
Script to seed Firestore with demo data for the AI Learning Companion.
Populates Teachers, Parents, Students, Resources, and Feed.
"""
import uuid
import datetime
from services.firebase_service import init_firebase, _get_db

def seed_data():
    print("🚀 Initializing Demo Data Seeding...")
    init_firebase()
    db = _get_db()
    if db is None:
        print("❌ Error: Firebase not initialized. Check your credentials.")
        return

    # Cleanup old demo data to prevent conflicts
    print("🧹 Cleaning up old demo data...")
    db.collection("progress").document("S_CHILD_01").delete()
    db.collection("students").document("S_CHILD_01").delete()
    for doc in db.collection("progress").where("student_id", "==", "S_CHILD_01").stream():
        doc.reference.delete()

    # 1. Demo Users (for Auth)
    users = [
        {
            "id": "T_DEMO_01",
            "name": "Sarah Jenkins",
            "email": "sarah@demo.com",
            "password": "demo123",
            "role": "teacher",
            "school": "Evergreen Academy",
            "created_at": datetime.datetime.now().isoformat()
        },
        {
            "id": "P_DEMO_01",
            "name": "Emma Johnson",
            "email": "emma@demo.com",
            "password": "demo123",
            "role": "parent",
            "child_name": "Alex Johnson",
            "child_age": 5,
            "child_id": "S_CHILD_01", # Added child_id for parent
            "created_at": datetime.datetime.now().isoformat()
        },
        {
            "id": "S_CHILD_01",
            "name": "Alex Johnson",
            "email": "alex@demo.com",
            "role": "student",
            "child_age": 5,
            "created_at": datetime.datetime.now().isoformat()
        }
    ]

    for user in users:
        db.collection("users").document(user["id"]).set(user)
        print(f"✅ User Seeded: {user['name']} ({user['role']})")

    # 1.5 Student Metadata (for Teacher Dashboard)
    student_meta = {
        "id": "S_CHILD_01",
        "name": "Alex Johnson",
        "class_id": "C_PLAYGROUP_01",
        "age": 5
    }
    db.collection("students").document("S_CHILD_01").set(student_meta)
    print(f"✅ Student Meta Seeded: {student_meta['name']}")

    # 2. Demo Resources (Teacher Hub)
    resources = [
        {
            "id": "RES_DEMO_01",
            "teacher_id": "T_DEMO_01",
            "title": "Introduction to Ocean Life",
            "type": "Document (PDF/DOCX)",
            "source": "ocean_intro.pdf",
            "content": "Ocean life is incredibly diverse. From tiny plankton to the massive Blue Whale, every creature plays a vital role. Coral reefs are like underwater cities...",
            "created_at": datetime.datetime.now().isoformat()
        },
        {
            "id": "RES_DEMO_02",
            "teacher_id": "T_DEMO_01",
            "title": "The Alphabet Adventure",
            "type": "YouTube Link",
            "source": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "content": "A interactive video song about letters A to Z with fun animations and mnemonic sounds.",
            "created_at": datetime.datetime.now().isoformat()
        }
    ]

    for res in resources:
        db.collection("resources").document(res["id"]).set(res)
        print(f"✅ Resource Seeded: {res['title']}")

    # 3. Demo Activities & Feed
    # Activity 1: Flashcards (Assigned)
    from services.progress_service import record_activity_completion
    from services.firebase_service import create_activity, add_to_student_feed

    act1_id = "ACT_DEMO_01"
    act1 = {
        "id": act1_id,
        "teacher_id": "T_DEMO_01",
        "activity_type": "flashcards",
        "topic": "Ocean Creatures",
        "content": {
            "flashcards": [
                {"front": "Dolphin", "back": "A friendly sea animal", "emoji": "🐬"},
                {"front": "Shark", "back": "A big hunter fish", "emoji": "🦈"},
                {"front": "Whale", "back": "The biggest mammal", "emoji": "🐋"},
                {"front": "Octopus", "back": "An 8-legged ocean friend", "emoji": "🐙"}
            ]
        },
        "created_at": datetime.datetime.now().isoformat()
    }
    db.collection("activities").document(act1_id).set(act1)
    add_to_student_feed("S_CHILD_01", act1_id, "flashcards")

    # Activity 2: Video (Completed)
    act2_id = "ACT_DEMO_02"
    act2 = {
        "id": act2_id,
        "teacher_id": "T_DEMO_01",
        "activity_type": "video",
        "topic": "Letters A-E",
        "content": {
            "video_url": "https://firebasestorage.googleapis.com/v0/b/datathon-cit.appspot.com/o/demo%2Fsample_alphabet.mp4?alt=media",
            "flashcards": [
                {"front": "A", "back": "Apple", "emoji": "🍎"},
                {"front": "B", "back": "Bear", "emoji": "🐻"}
            ]
        },
        "created_at": (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat()
    }
    db.collection("activities").document(act2_id).set(act2)
    add_to_student_feed("S_CHILD_01", act2_id, "video")
    record_activity_completion("S_CHILD_01", act2_id, "Alphabet", 95)

    # 4. Demo Progress History (Using Service)
    record_activity_completion("S_CHILD_01", "MOCK_01", "Animals", 85)
    record_activity_completion("S_CHILD_01", "MOCK_02", "Numbers", 60)
    record_activity_completion("S_CHILD_01", "MOCK_03", "Shapes", 90)

    print("✅ All Demo Data Seeded via Services")

    print("\n✨ Seeding Complete! Demo accounts ready for sarah@demo.com and emma@demo.com")

if __name__ == "__main__":
    seed_data()
