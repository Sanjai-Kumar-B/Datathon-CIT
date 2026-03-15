"""
Firebase Firestore service — initialise the app and provide read/write helpers.
"""

import os
import firebase_admin
from firebase_admin import credentials, firestore
from config import settings


_db = None  # module-level Firestore client


def init_firebase() -> None:
    """Initialise the Firebase Admin SDK (no-op if already initialised)."""
    global _db

    if _db is not None:
        return

    cred_path = settings.FIREBASE_CREDENTIALS_PATH

    if not os.path.exists(cred_path):
        print(
            f"⚠️  Firebase credentials file not found at '{cred_path}'. "
            "Firestore storage will be disabled. "
            "Copy your service-account JSON and set FIREBASE_CREDENTIALS_PATH in .env."
        )
        return

    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    _db = firestore.client()
    print("✅ Firebase initialised successfully.")


def _get_db():
    """Return the Firestore client, or None if Firebase is not configured."""
    return _db


def save_query(collection: str, data: dict) -> str:
    """
    Save a document to a Firestore collection.
    Returns the document ID, or a placeholder if Firebase is not available.
    """
    db = _get_db()
    if db is None:
        # Firebase not configured — return a placeholder ID
        return "no-firebase"

    try:
        doc_ref = db.collection(collection).document()
        data["id"] = doc_ref.id
        doc_ref.set(data)
        return doc_ref.id
    except Exception as e:
        print(f"⚠️  Firestore error in save_query: {e}")
        return "error-save"


def get_queries(collection: str, limit: int = 20) -> list[dict]:
    """Retrieve the most recent documents from a Firestore collection."""
    db = _get_db()
    if db is None:
        return []

    try:
        docs = db.collection(collection).limit(limit).stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg:
            print("❌ FIREBASE ERROR: Permission denied (403). Check if Firestore API is enabled.")
        else:
            print(f"⚠️  Firestore error in get_queries: {error_msg}")
        return []


def create_activity(activity_data: dict) -> str:
    """Save an activity to the activities collection."""
    db = _get_db()
    if db is None:
        return "no-firebase"

    try:
        doc_ref = db.collection("activities").document()
        activity_data["id"] = doc_ref.id
        import datetime
        activity_data["created_at"] = datetime.datetime.now().isoformat()
        doc_ref.set(activity_data)
        return doc_ref.id
    except Exception as e:
        print(f"⚠️  Firestore error in create_activity: {e}")
        return f"error-{activity_data.get('activity_type', 'activity')}"


def add_to_student_feed(student_id: str, activity_id: str, activity_type: str) -> bool:
    """Link an activity to a student feed."""
    db = _get_db()
    if db is None:
        return False

    import datetime
    feed_data = {
        "student_id": student_id,
        "activity_id": activity_id,
        "activity_type": activity_type,
        "status": "assigned",
        "created_at": datetime.datetime.now().isoformat()
    }
    
    try:
        doc_ref = db.collection("student_feed").document()
        feed_data["id"] = doc_ref.id
        doc_ref.set(feed_data)
        return True
    except Exception as e:
        print(f"⚠️  Firestore error in add_to_student_feed: {e}")
        return False


def get_student_feed(student_id: str) -> list[dict]:
    """Retrieve assigned activities for a student, joining with activity details."""
    db = _get_db()
    if db is None:
        return []

    try:
        # Get feed entries
        feed_docs = db.collection("student_feed").where("student_id", "==", student_id).stream()
        
        feed_items = []
        activity_ids = []
        for doc in feed_docs:
            item = doc.to_dict()
            feed_items.append(item)
            activity_ids.append(item["activity_id"])
            
        if not activity_ids:
            return []

        # Batch fetch all activity details at once (efficiency optimization)
        activities_map = {}
        doc_refs = [db.collection("activities").document(aid) for aid in set(activity_ids)]
        activity_snapshots = db.get_all(doc_refs)
        
        for snap in activity_snapshots:
            if snap.exists:
                activities_map[snap.id] = snap.to_dict()

        # Merge activity details back into feed items
        for item in feed_items:
            item["activity_details"] = activities_map.get(item["activity_id"])
        
        # Sort by date (descending)
        feed_items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return feed_items
    except Exception as e:
        print(f"⚠️  Firestore error in get_student_feed: {e}")
        return []


def get_user_language(user_id: str) -> str:
    """Fetch the language for any user from the users collection."""
    db = _get_db()
    if not db:
        return "en"

    try:
        user_doc = db.collection("users").document(user_id).get()
        if user_doc.exists:
            return user_doc.to_dict().get("language", "en")
    except Exception as e:
        print(f"⚠️ Error fetching user language: {e}")
    
    return "en"
