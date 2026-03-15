"""
Pydantic models for request and response schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ── Teacher Assistant ──────────────────────────────────────────────

class TeacherAssistantRequest(BaseModel):
    question: str = Field(..., description="The teaching question from the teacher or parent")
    child_age: int = Field(..., ge=3, le=8, description="Age of the child (3-8 years)")
    language: str = Field(default="en", description="Preferred language code (e.g., 'en', 'ta', 'hi')")
    resource_id: str = Field(None, description="Optional ID of a resource to use as context")


class TeacherAssistantResponse(BaseModel):
    id: str = Field(..., description="Unique ID of the stored query")
    question: str
    answer: str = Field(..., description="Main teaching guidance from the AI")
    activities: list[str] = Field(default_factory=list, description="Suggested learning activities")
    tips: list[str] = Field(default_factory=list, description="Teaching tips for the educator")
    language: str


# ── Translation ────────────────────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    target_language: str = Field(..., description="Target language name or code (e.g., 'Tamil', 'Hindi', 'es')")


class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str


# ── Flashcards ─────────────────────────────────────────────────────

class Flashcard(BaseModel):
    front: str = Field(..., description="Question or prompt side of the flashcard")
    back: str = Field(..., description="Answer or explanation side")
    emoji: str = Field(..., description="A fun emoji representing the concept")


class FlashcardRequest(BaseModel):
    topic: str = Field(..., description="Topic to create flashcards for (e.g., 'Animals', 'Numbers 1-10')")
    child_age: int = Field(..., ge=3, le=8, description="Age of the child (3-8 years)")
    count: int = Field(default=5, ge=1, le=15, description="Number of flashcards to generate")
    language: str = Field(default="en", description="Target language code")
    resource_id: str = Field(None, description="Optional ID of a resource to use as context")


class FlashcardResponse(BaseModel):
    topic: str
    flashcards: list[Flashcard]


# ── Ecosystem Foundation ───────────────────────────────────────────

class ActivityBase(BaseModel):
    teacher_id: str = Field(..., description="ID of the teacher who created the activity")
    activity_type: str = Field(..., description="Type of activity (e.g., 'flashcards', 'lesson')")
    topic: str = Field(..., description="Topic of the activity")
    content: dict = Field(..., description="Structured content of the activity (e.g., flashcard list)")


class PublishActivityRequest(BaseModel):
    teacher_id: str
    student_id: str
    activity_type: str
    content: dict


class ActivityResponse(ActivityBase):
    id: str
    created_at: str


class StudentFeedItem(BaseModel):
    id: str
    student_id: str
    activity_id: str
    activity_type: str
    status: str = Field(default="assigned")
    created_at: str
    activity_details: ActivityResponse = None


class StudentFeedResponse(BaseModel):
    student_id: str
    activities: list[StudentFeedItem]


# ── Multimodal Resources ───────────────────────────────────────────

class ResourceBase(BaseModel):
    teacher_id: str = Field(..., description="ID of the teacher who uploaded the resource")
    type: str = Field(..., description="Type of resource (pdf, docx, web, youtube, audio, image)")
    title: str = Field(..., description="Title or name of the resource")
    source: str = Field(..., description="Original source (URL or filename)")


class ResourceUploadRequest(BaseModel):
    teacher_id: str
    title: str
    resource_type: str = Field(..., description="one of: pdf, docx, web, youtube, audio, image")
    source_url: str = Field(None, description="URL for web or youtube resources")
    target_language: str = Field(default="en", description="Preferred language for extracted content")


class ResourceResponse(ResourceBase):
    id: str = Field(..., description="Unique ID of the stored resource")
    content: str = Field(..., description="Extracted text content")
    created_at: str


# ── AI Recommendations ─────────────────────────────────────────────

class RecommendationResponse(BaseModel):
    student_id: str
    weak_topic: str
    activity: str
    reason: str
    is_reinforcement: bool = False


# ── Animated Video Generation ──────────────────────────────────────

class VideoGenerationRequest(BaseModel):
    resource_id: str = Field(..., description="ID of the resource to convert to video")

class VideoResponse(BaseModel):
    resource_id: str
    video_url: str
    scenes_generated: int
    created_at: str


# ── Authentication ─────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = Field(..., description="Role: teacher, parent, or student")
    school: Optional[str] = None
    child_name: Optional[str] = None
    child_age: Optional[int] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: str
