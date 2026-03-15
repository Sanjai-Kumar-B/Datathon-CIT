"""
Router for Multimodal Resource Ingestion.
"""

import os
import tempfile
import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.schemas import ResourceResponse
from services.resource_service import extract_text
from services.firebase_service import _get_db

router = APIRouter()

@router.post("/upload-resource", status_code=201)
async def upload_resource(
    teacher_id: str = Form(...),
    title: str = Form(...),
    resource_type: str = Form(...),
    source_url: str = Form(None),
    target_language: str = Form("en"),
    file: UploadFile = File(None)
):
    """
    Ingest a resource from a file or URL.
    Extracts text and saves to the 'resources' collection.
    """
    db = _get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase is not configured")

    content = ""
    source = source_url or (file.filename if file else "unknown")

    # 1. Processing
    if file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        try:
            content = extract_text(file_path=tmp_path, resource_type=resource_type, title=title)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    elif source_url:
        content = extract_text(source_url=source_url, resource_type=resource_type, title=title)
    else:
        raise HTTPException(status_code=400, detail="Either file or source_url must be provided")

    # Content is now guaranteed by the fallback in extract_text

    # 1.5 Optional content translation
    if target_language and target_language.lower() != "en":
        from services.translation_service import translate_if_needed
        content = translate_if_needed(content, target_language)

    # 2. Storage
    resource_data = {
        "teacher_id": teacher_id,
        "type": resource_type,
        "title": title,
        "content": content,
        "source": source,
        "created_at": datetime.datetime.now().isoformat()
    }

    try:
        doc_ref = db.collection("resources").document()
        resource_data["id"] = doc_ref.id
        doc_ref.set(resource_data)
        return resource_data
    except Exception as e:
        print(f"⚠️ Firestore error (resources): {e}")
        raise HTTPException(status_code=500, detail="Failed to save resource to database")


@router.get("/resources/{teacher_id}")
async def get_teacher_resources(teacher_id: str):
    """Retrieve all resources uploaded by a specific teacher."""
    db = _get_db()
    if db is None:
        return []

    try:
        docs = db.collection("resources").where("teacher_id", "==", teacher_id).stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        print(f"⚠️ Firestore error (get_resources): {e}")
        return []
