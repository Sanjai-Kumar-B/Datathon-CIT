"""
Router: POST /api/generate-video
Triggers the animation pipeline to create an educational video from a resource.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import VideoGenerationRequest, VideoResponse
from services import video_service, firebase_service

router = APIRouter()

@router.post("/generate-video", response_model=VideoResponse)
async def generate_video(req: VideoGenerationRequest):
    """
    Generate a 3-5 scene animated video from an existing resource.
    Fetches extracted text from Firestore and runs the AI video pipeline.
    """
    try:
        # 1. Fetch resource text
        db = firebase_service._get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Firestore not configured")
            
        doc = db.collection("resources").document(req.resource_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Resource not found")
            
        resource_data = doc.to_dict()
        resource_text = resource_data.get("content", "")
        
        if not resource_text:
            raise HTTPException(status_code=400, detail="Resource has no content to process")
            
        # 2. Call Video Service
        result = video_service.generate_learning_video(req.resource_id, resource_text)
        
        if not result.get("video_url"):
            raise HTTPException(status_code=500, detail="Video generation failed in the pipeline")
            
        return VideoResponse(**result)

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"⚠️ Video Router Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
