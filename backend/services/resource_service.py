"""
Resource processing service — handling text extraction from multimodal sources.
"""

import os
import tempfile
import requests
from bs4 import BeautifulSoup
# Heavy imports moved inside functions to allow fast app startup

# Global model cache to prevent reloading on every request
_MODEL_CACHE = {}

def extract_text(file_path: str = None, source_url: str = None, resource_type: str = "pdf", title: str = "Educational Topic") -> str:
    """
    Unified text extraction function for varied resource types.
    Falls back to Gemini-generated content if extraction yields nothing.
    """
    extracted = ""
    try:
        if resource_type == "pdf" and file_path:
            extracted = _extract_from_pdf(file_path)
        elif resource_type == "docx" and file_path:
            extracted = _extract_from_docx(file_path)
        elif resource_type == "web" and source_url:
            extracted = _extract_from_web(source_url)
        elif resource_type == "youtube" and source_url:
            extracted = _extract_from_youtube(source_url)
        elif resource_type == "audio" and file_path:
            extracted = _extract_from_audio(file_path)
        elif resource_type == "image" and file_path:
            extracted = _extract_from_image(file_path)
        
        # Fallback if extraction is empty or too short
        if not extracted or len(extracted.strip()) < 10:
            print(f"ℹ️ Extraction yielded minimal content for '{title}', invoking Gemini fallback...")
            extracted = _generate_fallback_content(title, resource_type)
            
        return extracted
    except Exception as e:
        print(f"⚠️ Extraction error ({resource_type}): {e}")
        # Always return fallback instead of crashing or hanging
        return _generate_fallback_content(title, resource_type)

def _generate_fallback_content(title: str, resource_type: str) -> str:
    """
    Use Gemini to generate educational content based on the title when extraction fails.
    """
    from services import gemini_service
    try:
        model = gemini_service._get_model()
        prompt = (
            f"The user uploaded a {resource_type} resource titled '{title}', but we couldn't extract the text.\n"
            f"Generate a concise, high-quality educational summary and 3 key learning points about '{title}' "
            f"suitable for early childhood education (ages 3-8).\n"
            f"Keep it extremely brief and safe."
        )
        response = model.generate_content(prompt)
        if response and hasattr(response, 'text'):
            return response.text.strip()
        return f"Let's explore {title} together! It's an amazing topic where we'll discover new things every day."
    except Exception as e:
        print(f"⚠️ Gemini Fallback Content Error: {e}")
        return f"Learning about {title} is an adventure! We'll have so much fun exploring this together."

def _extract_from_pdf(path: str) -> str:
    from pypdf import PdfReader
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text.strip()
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

def _extract_from_docx(path: str) -> str:
    from docx import Document
    try:
        doc = Document(path)
        return "\n".join([para.text for para in doc.paragraphs if para.text]).strip()
    except Exception as e:
        print(f"DOCX Error: {e}")
        return ""

def _extract_from_web(url: str) -> str:
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for script_or_style in soup(["script", "style", "nav", "footer"]):
            script_or_style.decompose()
        return soup.get_text(separator="\n", strip=True)
    except Exception as e:
        print(f"Web Error: {e}")
        return ""

def _extract_from_youtube(url: str) -> str:
    from youtube_transcript_api import YouTubeTranscriptApi
    try:
        video_id = ""
        if "v=" in url:
            video_id = url.split("v=")[1].split("&")[0]
        elif "be/" in url:
            video_id = url.split("be/")[1].split("?")[0]
        
        if not video_id:
            return ""
        
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([t["text"] for t in transcript_list])
    except Exception as e:
        print(f"YouTube Error: {e}")
        return ""

def _extract_from_audio(path: str) -> str:
    try:
        import whisper
        if "whisper" not in _MODEL_CACHE:
            print("📦 Loading Whisper model (base)...")
            _MODEL_CACHE["whisper"] = whisper.load_model("base")
        
        model = _MODEL_CACHE["whisper"]
        result = model.transcribe(path)
        return result["text"].strip()
    except Exception as e:
        print(f"Whisper Error: {e}")
        return ""

def _extract_from_image(path: str) -> str:
    try:
        import pytesseract
        from PIL import Image
        return pytesseract.image_to_string(Image.open(path)).strip()
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
