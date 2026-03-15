"""
Google Gemini AI service — generates teaching responses, translations, and flashcards.
"""

import json
import google.generativeai as genai
from config import settings

# Configure the Gemini SDK on import
genai.configure(api_key=settings.GEMINI_API_KEY)


def _get_model():
    """Return a GenerativeModel instance."""
    return genai.GenerativeModel(settings.GEMINI_MODEL)


def _clean_json(raw: str) -> str:
    """Strip markdown code fences from a JSON response."""
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]  # remove opening fence line
        text = text.rsplit("```", 1)[0]  # remove closing fence
    return text.strip()


# ── Teacher Assistant ──────────────────────────────────────────────

def generate_teaching_response(question: str, child_age: int, language: str, context_text: str = None) -> dict:
    """
    Generate a structured teaching response for an early-childhood educator.
    Can optionally include context from uploaded resources.
    Returns a dict with keys: answer, activities, tips.
    """
    model = _get_model()

    context_prompt = f"Use the following learning material:\n{context_text}\n\n" if context_text else ""

    prompt = (
        context_prompt +
        "You are an expert early-childhood education assistant. "
        "You help teachers and parents teach young children aged 3 to 8 years old.\n\n"
        "Provide structured, practical, and age-appropriate teaching guidance.\n"
        "Respond ONLY with valid JSON (no extra text) with exactly these keys:\n"
        '- "answer" (string — main teaching guidance)\n'
        '- "activities" (array of strings — 3 to 5 hands-on activity suggestions)\n'
        '- "tips" (array of strings — 2 to 3 teaching tips)\n\n'
        "Make the language simple, warm, and encouraging.\n\n"
        f"Question: {question}\n"
        f"Child's age: {child_age} years old\n"
        f"Respond in language: {language}\n"
    )

    try:
        response = model.generate_content(prompt)
        raw = _clean_json(response.text)
        return json.loads(raw)
    except Exception as e:
        print(f"⚠️ Gemini API Error (Teaching): {e}")
        return {
            "answer": "The AI assistant is currently resting (quota reached) or busy. Please try again in 30 seconds for your teaching guidance!",
            "activities": [],
            "tips": []
        }


# ── Translation ────────────────────────────────────────────────────

def translate_text(text: str, target_language: str) -> str:
    """Translate the given text into the target language using Gemini."""
    model = _get_model()

    prompt = (
        "You are a professional translator specialising in educational content for young children. "
        "Translate the given text accurately while keeping it simple and child-friendly.\n"
        "Return ONLY the translated text, nothing else.\n\n"
        f"Translate the following text to {target_language}:\n\n{text}"
    )

    try:
        response = model.generate_content(prompt)
        if response and hasattr(response, 'text'):
            return response.text.strip()
        return text # Return original if AI fails
    except Exception as e:
        print(f"⚠️ Gemini API Error (Translation): {e}")
        return text


# ── Flashcards ─────────────────────────────────────────────────────

def generate_flashcards(topic: str, child_age: int, count: int, context_text: str = None) -> list[dict]:
    """
    Generate a list of flashcard dicts, each with keys: front, back, emoji.
    Can optionally include context from uploaded resources.
    """
    model = _get_model()

    context_prompt = f"Use the following learning material:\n{context_text}\n\n" if context_text else ""

    prompt = (
        context_prompt +
        "You are an expert early-childhood education assistant.\n"
        "Create fun, simple, age-appropriate flashcards for young children.\n"
        "Each flashcard must have a question/prompt on the front, an answer on the back, "
        "and a single emoji that represents the concept.\n"
        "Respond ONLY with a valid JSON array (no extra text) of objects with keys: front, back, emoji.\n\n"
        f"Topic: {topic}\n"
        f"Child's age: {child_age} years old\n"
        f"Number of flashcards: {count}\n"
    )

    try:
        response = model.generate_content(prompt)
        raw = _clean_json(response.text)
        return json.loads(raw)
    except Exception as e:
        print(f"⚠️ Gemini API Error (Flashcards/Quota): {e}")
        # Static fallback cards related to common topics
        return [
            {"front": f"What is {topic}?", "back": f"A fun subject to learn about!", "emoji": "✨"},
            {"front": "Learning is...", "back": "Exciting and full of wonder!", "emoji": "🌈"},
            {"front": "Knowledge", "back": "Helps us grow every day.", "emoji": "🧠"}
        ]


# ── Recommendation Engine ──────────────────────────────────────────

def generate_recommendation_activity(topic: str, child_age: int, is_reinforcement: bool = False) -> str:
    """
    Generate a recommended activity based on a weak topic or for reinforcement.
    """
    model = _get_model()

    if is_reinforcement:
        prompt = (
            f"You are an expert early-childhood education assistant.\n"
            f"The student is doing well in '{topic}'. Generate a fun reinforcement/extension activity "
            f"suitable for a {child_age}-year-old child to deepen their interest.\n"
            f"Return ONLY the activity description, warm and engaging."
        )
    else:
        prompt = (
            f"You are an expert early-childhood education assistant.\n"
            f"The student is weak in the topic '{topic}'. Generate a fun, supportive learning activity "
            f"suitable for a {child_age}-year-old child to improve understanding of this topic.\n"
            f"Return ONLY the activity description, encouraging and simple."
        )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"⚠️ Gemini API Error (Recommendation): {e}")
        return "Keep exploring and having fun while learning!"
