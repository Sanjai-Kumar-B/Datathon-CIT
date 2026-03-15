"""
Router: POST /api/translate
Translates educational text into a target language via Google Gemini.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import TranslateRequest, TranslateResponse
from services import gemini_service

router = APIRouter()


@router.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    """
    Translate educational content into the parent's preferred language.

    Supports any language name or code (e.g., "Tamil", "Hindi", "es", "fr").
    """
    try:
        translated = gemini_service.translate_text(
            text=req.text,
            target_language=req.target_language,
        )

        return TranslateResponse(
            original_text=req.text,
            translated_text=translated,
            target_language=req.target_language,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")
