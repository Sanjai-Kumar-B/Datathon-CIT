"""
FastAPI router for Ecosystem Foundation — connecting teachers, students, and parents.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import PublishActivityRequest, StudentFeedResponse, StudentFeedItem
from services.firebase_service import create_activity, add_to_student_feed, get_student_feed

router = APIRouter()

@router.post("/publish-activity", status_code=201)
async def publish_activity(request: PublishActivityRequest):
    """
    Assign a generated activity to a student feed.
    Saves to 'activities' and creates a 'student_feed' entry.
    """
    # 1. Save the activity content
    activity_data = {
        "teacher_id": request.teacher_id,
        "activity_type": request.activity_type,
        "topic": request.content.get("topic", "General"),
        "content": request.content
    }
    
    activity_id = create_activity(activity_data)
    if activity_id == "no-firebase":
        raise HTTPException(status_code=503, detail="Firebase is not configured")

    # 2. Add to student feed
    success = add_to_student_feed(
        student_id=request.student_id,
        activity_id=activity_id,
        activity_type=request.activity_type
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update student feed")

    return {
        "message": "Activity published successfully",
        "activity_id": activity_id,
        "student_id": request.student_id
    }


@router.get("/student-feed/{student_id}", response_model=StudentFeedResponse)
async def fetch_student_feed(student_id: str):
    """Retrieve all assigned activities for a specific student."""
    items = get_student_feed(student_id)
    return {
        "student_id": student_id,
        "activities": items
    }
