"""
Router: POST /api/generate-flashcards
Generates age-appropriate flashcards for a given topic via Google Gemini and stores in Firestore.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import FlashcardRequest, FlashcardResponse, Flashcard
from services import gemini_service, firebase_service

router = APIRouter()


@router.post("/generate-flashcards", response_model=FlashcardResponse)
async def generate_flashcards(req: FlashcardRequest):
    """
    Generate fun, age-appropriate flashcards for early-childhood learners.

    Example topic: "Colors", "Animals", "Numbers 1-10"
    """
    try:
        context_text = None
        if req.resource_id:
            db = firebase_service._get_db()
            doc = db.collection("resources").document(req.resource_id).get()
            if doc.exists:
                context_text = doc.to_dict().get("content")
                print(f"ℹ️ Using context from resource: {req.resource_id}")

        cards_raw = gemini_service.generate_flashcards(
            topic=req.topic,
            child_age=req.child_age,
            count=req.count,
            context_text=context_text
        )

        flashcards = [
            Flashcard(
                front=c.get("front", ""),
                back=c.get("back", ""),
                emoji=c.get("emoji", "📚"),
            )
            for c in cards_raw
        ]

        # Persist to Firestore
        doc_data = {
            "topic": req.topic,
            "child_age": req.child_age,
            "count": req.count,
            "flashcards": [card.model_dump() for card in flashcards],
        }
        firebase_service.save_query("flashcards", doc_data)

        # Auto-translation for child/parent
        # Assuming teacher_id is implicitly linked or provided in future; 
        # for now we use 'en' or fetch from req if available.
        # But wait, FlashcardRequest doesn't have student_id. 
        # Usually, the teacher generates these. 
        # However, Phase 3 says "Automatic Multilingual Support" based on preferred_language.
        # Let's check for an optional student_id/user_id in req or use the provided 'child_age' context.
        # Requirement says: "Children receive simplified localized content".
        # We'll use req.language (existing) but ensure it's used to translate the output cards too.
        
        from services.translation_service import translate_flashcards
        translated_cards = translate_flashcards([card.model_dump() for card in flashcards], req.language)

        return FlashcardResponse(
            topic=req.topic,
            flashcards=[Flashcard(**c) for c in translated_cards],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flashcard generation error: {str(e)}")
