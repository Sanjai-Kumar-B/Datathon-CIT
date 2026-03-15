
from services.firebase_service import _get_db, init_firebase

def check_resources():
    init_firebase()
    db = _get_db()
    if not db:
        print("❌ Firestore not initialized")
        return
    
    print("--- Resource Content Audit ---")
    docs = db.collection("resources").stream()
    found = False
    for doc in docs:
        found = True
        data = doc.to_dict()
        content = data.get("content", "")
        print(f"ID: {doc.id} | Title: {data.get('title')} | Type: {data.get('type')} | Content Length: {len(content)}")
        if not content:
            print(f"  ⚠️ WARNING: Content is EMPTY for '{data.get('title')}'")
    
    if not found:
        print("❌ No resources found in collection 'resources'")
    print("------------------------------")

if __name__ == "__main__":
    check_resources()
