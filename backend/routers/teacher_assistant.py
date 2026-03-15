"""
Router: POST /api/teacher-assistant
Accepts a teaching question, generates structured guidance via Google Gemini, and stores in Firestore.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import TeacherAssistantRequest, TeacherAssistantResponse
from services import gemini_service, firebase_service

router = APIRouter()


@router.post("/teacher-assistant", response_model=TeacherAssistantResponse)
async def teacher_assistant(req: TeacherAssistantRequest):
    """
    Generate structured teaching suggestions for early-childhood educators.

    Example question: "Give an activity to teach numbers to a 4-year-old."
    """
    try:
        context_text = None
        if req.resource_id:
            db = firebase_service._get_db()
            doc = db.collection("resources").document(req.resource_id).get()
            if doc.exists:
                context_text = doc.to_dict().get("content")
                print(f"ℹ️ Using context from resource: {req.resource_id}")

        result = gemini_service.generate_teaching_response(
            question=req.question,
            child_age=req.child_age,
            language=req.language,
            context_text=context_text
        )

        # Persist to Firestore
        doc_data = {
            "question": req.question,
            "child_age": req.child_age,
            "language": req.language,
            "answer": result.get("answer", ""),
            "activities": result.get("activities", []),
            "tips": result.get("tips", []),
        }
        doc_id = firebase_service.save_query("queries", doc_data)

        from services.translation_service import translate_if_needed
        
        translated_answer = translate_if_needed(result.get("answer", ""), req.language)
        translated_activities = [translate_if_needed(a, req.language) for a in result.get("activities", [])]
        translated_tips = [translate_if_needed(t, req.language) for t in result.get("tips", [])]

        return TeacherAssistantResponse(
            id=doc_id,
            question=req.question,
            answer=translated_answer,
            activities=translated_activities,
            tips=translated_tips,
            language=req.language,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")
