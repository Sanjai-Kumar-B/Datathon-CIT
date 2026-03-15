
import sys
import os

print("--- Resource Service Diagnostics ---")

libraries = [
    "pypdf",
    "docx",
    "bs4",
    "youtube_transcript_api",
    "whisper",
    "pytesseract"
]

for lib in libraries:
    try:
        if lib == "docx":
            import docx
        elif lib == "bs4":
            import bs4
        else:
            __import__(lib)
        print(f"✅ {lib} is installed.")
    except ImportError:
        print(f"❌ {lib} is NOT installed.")

# Check for Tesseract binary
import shutil
if shutil.which("tesseract"):
    print("✅ Tesseract binary found.")
else:
    print("❌ Tesseract binary NOT found (required for image OCR).")

print("--- End of Diagnostics ---")
