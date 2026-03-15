import firebase_admin
from firebase_admin import credentials, firestore
import os

cred_path = "../datathon-cit-firebase-adminsdk-fbsvc-f4570fab7a.json"

if not os.path.exists(cred_path):
    print("Cred path not found")
    exit(1)

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

try:
    print("Attempting to write to 'test_collection'...")
    doc_ref = db.collection("test_collection").document("test_doc")
    doc_ref.set({"status": "running", "message": "hello from test script"})
    print("✅ Write successful!")
except Exception as e:
    print(f"❌ Write failed: {e}")
