from services.firebase_service import init_firebase, _get_db

init_firebase()
db = _get_db()

print("--- COLLECTIONS ---")
cols = [c.id for c in db.collections()]
print(f"Collections: {cols}")

print("\n--- PROGRESS DATA ---")
docs = list(db.collection("progress").where("student_id", "==", "S_CHILD_01").stream())
print(f"Found {len(docs)} docs for S_CHILD_01")
for doc in docs:
    print(f"ID: {doc.id} => {doc.to_dict()}")

print("\n--- STUDENT META ---")
docs = list(db.collection("students").where("id", "==", "S_CHILD_01").stream())
if not docs:
    # Try doc ID
    d = db.collection("students").document("S_CHILD_01").get()
    if d.exists:
        print(f"ID: {d.id} (from doc ID) => {d.to_dict()}")
    else:
         print("No student meta found for S_CHILD_01 in collection 'students'")
else:
    for doc in docs:
        print(f"ID: {doc.id} => {doc.to_dict()}")
