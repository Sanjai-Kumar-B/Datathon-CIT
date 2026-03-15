# AI Learning Companion - Project Overview

An intelligent full-stack solution designed to empower teachers and parents in early childhood education (ages 3-8) using Generative AI.

## Project Description
The AI Learning Companion bridging the gap between classroom teaching and home learning by providing personalized pedagogical advice, visual aids, and multilingual support. It utilizes Google's **Gemini AI** for high-quality content generation and **Firebase Firestore** for persistent data storage.

## Current State: ✅ COMPLETED
The project is currently in a fully functional, integrated state.

### 1. Backend Architecture (FastAPI)
- **AI Service**: Custom integration with `gemini-2.0-flash` for rapid instruction and activity generation.
- **Firebase Integration**: Securely connected to Cloud Firestore for storing generated content.
- **API Endpoints**:
  - `POST /api/teacher-assistant`: Generates teaching guidance, activities, and tips.
  - `POST /api/generate-flashcards`: Creates structured flashcard data with emojis.
  - `POST /api/translate`: Provides context-aware translation into 9 regional languages.

### 2. Frontend Interface (Vite + React)
The frontend features a dual-dashboard system with distinct visual languages:
- **Teacher Dashboard (Vedantu-Inspired)**: A vibrant, sidebar-driven interface optimized for classroom productivity. Includes milestone tracking and quick-action cards.
- **Parent Dashboard (Professional & Warm)**: A calming, navbar-driven interface designed for home-based learning support.
- **Role Selection**: A landing page to toggle between the Teacher and Parent experiences.

### 3. Core Features
- **Smart Assistant**: Age-appropriate activity ideas for specific learning topics.
- **Flashcard Engine**: Generates 3D-flipping visual aids that can be printed.
- **Multilingual Support**: Translates instructions into Tamil, Hindi, Telugu, and more to support multilingual families.

## Directory Structure
```text
Datathon-CIT/
├── backend/                # FastAPI Application
│   ├── main.py             # Entry point, API setup
│   ├── config.py           # Env loading (Gemini, Firebase)
│   ├── routers/            # API Route definitions
│   ├── services/           # Business logic (Gemini, Firebase)
│   ├── models/             # Pydantic schemas
│   └── .env                # API Keys & Config
├── frontend/               # Vite + React Application
│   ├── src/
│   │   ├── pages/          # Teacher & Parent views
│   │   ├── components/     # Reusable UI (Cards, Loaders)
│   │   ├── services/       # API call definitions (Axios)
│   │   └── index.css       # Global Design System
│   └── package.json        # Dependencies
└── PROJECT_OVERVIEW.md      # This file
```

## Data Flow
1. **User Interaction**: User interacts with the React frontend (e.g., asks a teaching question).
2. **API Request**: Frontend sends a JSON payload to the FastAPI backend.
3. **AI Processing**: Backend calls the **Gemini AI service** using the system instructions and user input.
4. **Data Persistence**: Backend stores the prompt and AI response in **Firebase Firestore** for history.
5. **Response Display**: Generated content is returned to the frontend and rendered in role-specific layouts.

## Technical Stack
- **Frontend**: Vite, React 19, React Router 7, Axios, Lucide-React.
- **Backend**: Python 3.12, FastAPI, Uvicorn, Google Generative AI (Gemini SDK), Firebase Admin SDK.
- **Database**: Cloud Firestore.
- **Design**: Vanilla CSS with Design Tokens.

## How to Run
1. **Backend**:
   ```bash
   cd backend
   # Ensure dependencies are installed: pip install -r requirements.txt
   python -m uvicorn main.py:app --reload --port 8000
   ```
2. **Frontend**:
   ```bash
   cd frontend
   # Ensure dependencies are installed: npm install
   npm run dev -- --port 5173
   ```

## Next Steps / Future Scope
- User authentication and persistent profiles.
- Image generation for flashcards using Imagen or DALL-E.
- Integration with student progress tracking data.
