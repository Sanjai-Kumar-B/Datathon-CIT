# AI Learning Companion - Backend

High-performance API built with FastAPI, providing intelligent educational services powered by Google Gemini.

## 🚀 API Endpoints

### 1. Teacher Assistant
`POST /api/teacher-assistant`
- **Purpose**: Generates pedagogical guidance and activities.
- **Input**: `{ question: string, child_age: int, language: string }`
- **Output**: Returns an object with `answer`, `activities`, and `tips`.

### 2. Flashcard Generator
`POST /api/generate-flashcards`
- **Purpose**: Creates visual/verbal flashcard pairs for learning.
- **Input**: `{ topic: string, child_age: int, count: int }`
- **Output**: List of objects with `front`, `back`, and `emoji`.

### 3. Regional Translator
`POST /api/translate`
- **Purpose**: Translates text into regional Indian languages while maintaining educational context.
- **Input**: `{ text: string, target_language: string }`
- **Output**: `{ translated_text: string }`

## 🛠️ Configuration
The backend uses a `.env` file for secrets:
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to the Firebase JSON credentials file.

## 📂 Logic Flow
The backend logic is decoupled into:
- **Routers**: Handle HTTP requests and input validation.
- **Gemini AI Service**: `genai` integration for lesson plans and flashcards.
- **Firebase Service**: `firebase_service.py` handles Firestore CRUD operations.

## 🧪 Testing
Access the interactive Swagger documentation at `http://localhost:8000/docs` to test all endpoints live.
