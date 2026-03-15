"""
Pydantic models for activity completion and progress analytics.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any, Dict, List, Optional

class ActivityCompletionRequest(BaseModel):
    student_id: str = Field(..., description="ID of the student who completed the activity")
    activity_id: str = Field(..., description="ID of the activity being completed")
    topic: str = Field(..., description="Learning topic (e.g., 'numbers', 'alphabet')")
    score: int = Field(..., ge=0, le=100, description="Score achieved (0-100)")

class ActivityCompletionResponse(BaseModel):
    message: str
    progress_recorded: bool
    recommendation: Optional[Dict[str, Any]] = None

class StudentProgressSummary(BaseModel):
    student_id: str
    progress_summary: Dict[str, float] = Field(..., description="Average score per topic")
    completed_activities: int = Field(..., description="Total number of completed activities")

class StudentClassPerformance(BaseModel):
    student_id: str
    name: str
    topic_progress: Dict[str, float] = Field(..., description="Progress percentage per topic")

class ClassAnalyticsResponse(BaseModel):
    class_id: str
    students: List[StudentClassPerformance]
