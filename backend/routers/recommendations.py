"""
Router: GET /api/recommendations/{student_id}
Provides AI-driven learning recommendations based on student performance.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import RecommendationResponse
from services.recommendation_service import get_recommendation

router = APIRouter()

@router.get("/recommendations/{student_id}", response_model=RecommendationResponse)
async def get_student_recommendation(student_id: str):
    """
    Fetch a personalized learning recommendation for a student.
    Analyzes Firestore progress data and uses Google Gemini for generation.
    """
    try:
        recommendation = get_recommendation(student_id)
        if not recommendation:
            raise HTTPException(status_code=404, detail="Could not generate recommendation")
        
        return recommendation
    except Exception as e:
        print(f"⚠️ Recommendation Router Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
