"""
FastAPI router for Progress Tracking — recording completions and serving analytics.
"""

from fastapi import APIRouter, HTTPException
from models.progress_models import ActivityCompletionRequest, StudentProgressSummary, ClassAnalyticsResponse, ActivityCompletionResponse
from services import progress_service, recommendation_service

router = APIRouter()

@router.post("/complete-activity", response_model=ActivityCompletionResponse, status_code=201)
async def complete_activity(request: ActivityCompletionRequest):
    """
    Record that a student has completed an activity and suggest the next one.
    Updates 'progress' collection and 'student_feed' status.
    """
    success = progress_service.record_activity_completion(
        student_id=request.student_id,
        activity_id=request.activity_id,
        topic=request.topic,
        score=request.score
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to record activity completion")
    
    # Generate automatic recommendation for the next step
    recommendation = recommendation_service.get_recommendation(request.student_id)
        
    return ActivityCompletionResponse(
        message="Activity completion recorded and next step suggested!",
        progress_recorded=True,
        recommendation=recommendation
    )

@router.get("/student-progress/{student_id}", response_model=StudentProgressSummary)
async def get_student_progress(student_id: str):
    """
    Retrieve aggregated progress summary for a parent to view.
    """
    summary = progress_service.get_student_progress_summary(student_id)
    return summary

@router.get("/class-progress/{class_id}", response_model=ClassAnalyticsResponse)
async def get_class_progress(class_id: str):
    """
    Retrieve class-wide analytics for a teacher.
    """
    analytics = progress_service.get_class_analytics(class_id)
    return analytics
