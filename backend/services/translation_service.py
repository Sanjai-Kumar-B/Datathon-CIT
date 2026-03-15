"""
Translation service — automates content localization using Gemini.
"""

from services import gemini_service

def translate_if_needed(text: str, target_language: str) -> str:
    """
    Translates text to the target language if it's not English.
    Returns the original text if target is 'en' or translation fails.
    """
    if not text or not target_language or target_language.lower() == "en":
        return text

    # Map language codes to names for better Gemini understanding if needed
    lang_map = {
        "ta": "Tamil",
        "hi": "Hindi",
        "te": "Telugu",
        "kn": "Kannada",
        "ml": "Malayalam",
        "es": "Spanish",
        "fr": "French"
    }
    target_lang_name = lang_map.get(target_language.lower(), target_language)

    try:
        translated = gemini_service.translate_text(text, target_lang_name)
        if not translated:
            return text
        return translated
    except Exception as e:
        print(f"⚠️ Automatic translation failure ({target_language}): {e}")
        return text

def translate_flashcards(flashcards: list, target_language: str) -> list:
    """
    Translates a list of flashcards (front/back) while preserving structure and emojis.
    """
    if not target_language or target_language.lower() == "en":
        return flashcards

    translated_cards = []
    for card in flashcards:
        # We translate front and back separately or together in one prompt to stay efficient.
        # For simplicity and robustness here, we do it in one pass if possible.
        try:
            front = translate_if_needed(card.get("front", ""), target_language)
            back = translate_if_needed(card.get("back", ""), target_language)
            translated_cards.append({
                "front": front,
                "back": back,
                "emoji": card.get("emoji", "📚")
            })
        except Exception:
            translated_cards.append(card)
            
    return translated_cards
