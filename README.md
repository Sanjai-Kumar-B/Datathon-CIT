# AI Learning Companion 🚀

AI Learning Companion is an AI-powered educational platform designed for **early childhood education (ages 3–8)**. The system connects **Teachers, Parents, and Children** through an intelligent learning ecosystem that leverages **Generative AI, Multimodal Processing, and Adaptive Learning** to transform fragmented educational resources into personalized, engaging learning experiences.

---

## 💡 Core Problems Solved

1.  **Fragmented Learning Resources**: Traditional materials are often scattered across PDFs, websites, and videos. Our system aggregates these into a unified knowledge base.
2.  **Multimodal Educational Data**: We process diverse formats (documents, audio, video, etc.) to ensure that learning is not limited by the medium.
3.  **Multilingual Learning Barriers**: By providing automatic localization, we ensure that language is never a barrier for parents or children in diverse communities.
4.  **Lack of Contextual Intelligence**: Traditional systems offer static content. Our adaptive recommendation engine provides contextual suggestions based on real-time performance.

---

## ✨ Key Features

### 📂 1. Multimodal Resource Ingestion
Teachers can upload learning materials in various formats:
*   **Documents**: PDF, DOCX
*   **Web**: Direct URLs, YouTube Video Transcripts
*   **Media**: Audio files (transcribed via Whisper), Images (via OCR)
The system extracts clean text from these sources, preparing them for AI-driven transformation.

### 🤖 2. AI Teaching Assistant
Powered by **Google Gemini AI**, the assistant helps educators generate:
*   Structured lesson plans.
*   Hands-on classroom activity suggestions.
*   Practical teaching tips tailored to the child's age.

### 🎴 3. Flashcard Generation
Instantly creates child-friendly digital flashcards for any topic.
*   **Interactive**: Questions on the front, answers on the back.
*   **Engaging**: Each card includes a fun AI-selected emoji.

### 🎬 4. Animated Learning Videos
Converts static text into short educational animations.
*   **Pipeline**: Resource Text → AI Storyboard → Stable Diffusion Images → MoviePy Video Assembly.
*   **Format**: Short, 10-15 second cartoons with narration and visuals.

### 🧠 5. Adaptive Recommendation Engine
Analyzes student performance data to suggest the **Next Mission**.
*   Identifies weak topics for reinforcement.
*   Suggests extension activities for mastered topics.

### 📈 6. Student Progress Tracking
Comprehensive analytics for the whole ecosystem:
*   **Children**: Earn completion status for activities.
*   **Parents**: Detailed reports on topic mastery and performance.
*   **Teachers**: Class-wide insights to identify students needing extra support.

### 🌐 7. Automatic Multilingual Support
Content is automatically delivered in the user's preferred language:
*   **Supported**: English, Tamil, Hindi, Telugu, Kannada, Malayalam.
*   **Scope**: Flashcards, activities, recommendations, and video narrations.

---

## 🏗️ System Architecture

The AI Learning Companion follows a modular, layered architecture:

**Frontend** (React + Vite)  
↓  
**API Routers** (FastAPI)  
↓  
**Service Layer** (Gemini AI, Stable Diffusion, MoviePy, Resource Extractors)  
↓  
**Firestore Database** (Real-time storage for progress, feed, and assets)

### Tech Stack
*   **Frontend**: React, Vite, Axios, TailwindCSS (for styling).
*   **Backend**: FastAPI (Python), Uvicorn.
*   **AI**: Google Gemini Pro, Stable Diffusion (Diffusers), Whisper, Pytesseract.
*   **Media Processing**: MoviePy, PyPDF, Docx.
*   **Database**: Firebase Firestore.

---

## 📂 Project Structure

```bash
backend/
├── config/             # Environment & App Configuration
├── models/             # Pydantic Schemas & Data Models
├── routers/            # FastAPI Endpoint Definitions
│   ├── teacher_assistant.py
│   ├── flashcards.py
│   ├── progress.py
│   ├── resources.py
│   └── video.py
├── services/           # Business Logic & AI Orchestration
│   ├── gemini_service.py
│   ├── video_service.py
│   └── translation_service.py
└── main.py             # App Entry Point

frontend/
├── src/
│   ├── teacher/        # Teacher Workflows (Lesson Planning, Analytics)
│   ├── parent/         # Parent Workflows (Progress Reports)
│   ├── child/          # Kid-friendly Mission Feed & Play
│   ├── components/     # Reusable UI (Cards, Loaders, Layouts)
│   └── services/       # API Integration (Axios wrappers)
```

---

## 🚀 How to Run the Project

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   Firebase Project (Service Account JSON)
*   Google Gemini API Key

### Backend Setup
1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `pip install -r requirements.txt`
3.  Create a `.env` file from the template:
    ```env
    GEMINI_API_KEY=your_api_key
    FIREBASE_CREDENTIALS_PATH=path/to/service_account.json
    ```
4.  Run the development server:
    `python -m uvicorn main:app --reload --port 8000`

### Frontend Setup
1.  Navigate to the frontend directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run the dev server: `npm run dev`
4.  Access the UI at: `http://localhost:5173`

---

## 🛠️ Main API Endpoints

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/teacher-assistant` | `POST` | Get AI teaching guidance |
| `/api/generate-flashcards` | `POST` | Generate themed flashcards |
| `/api/upload-resource` | `POST` | Ingest documents/URLs |
| `/api/generate-video` | `POST` | Create animated animation |
| `/api/complete-activity` | `POST` | Log score & get recommendation |
| `/api/student-progress/{id}`| `GET` | View parent dashboard data |

---

## 👥 User Roles

*   **Teacher**: Uploads materials, generates lessons/flashcards, and monitors the "Class Progress" dashboard.
*   **Parent**: Views the "Progress Report," receives AI-driven practice recommendations, and accesses localized content.
*   **Child**: Navigates a colorful "Mission Feed," plays through flashcards/activities, and watches "Animated Lessons."

---

## 🔮 Future Improvements
*   **Spoken Narration**: Adding Text-to-Speech for video narration in local languages.
*   **Real-time Tutoring**: An AI chatbot for children to ask "Why?" questions during activities.
*   **Mobile App**: Flutter or React Native version for on-the-go learning.
*   **GPU Cluster**: Moving video generation to background workers on dedicated GPU nodes for instant rendering.

---

## 📝 Conclusion
The AI Learning Companion is an **AI-powered adaptive multilingual learning ecosystem** designed to bridge the gap between fragmented educational content and the personalized needs of early childhood learners. It is modular, stable, and ready to redefine the digital classroom.

**Developed for Hackathon 2026.**
