"""
AI Learning Companion — FastAPI Backend
========================================
Main application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
from services.firebase_service import init_firebase
from routers import teacher_assistant, translate, flashcards, ecosystem, progress, resources, recommendations, video, auth


# ── App Initialisation ─────────────────────────────────────────────

app = FastAPI(
    title="AI Learning Companion",
    description=(
        "An AI-powered educational assistant that helps teachers and parents "
        "teach early childhood students (ages 3–8) more effectively."
    ),
    version="1.0.0",
)


# ── CORS ───────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup Event ──────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    """Initialise Firebase on startup."""
    init_firebase()


# ── Routers ────────────────────────────────────────────────────────

app.include_router(teacher_assistant.router, prefix="/api", tags=["Teacher Assistant"])
app.include_router(translate.router, prefix="/api", tags=["Translation"])
app.include_router(flashcards.router, prefix="/api", tags=["Flashcards"])
app.include_router(ecosystem.router, prefix="/api", tags=["Ecosystem"])
app.include_router(progress.router, prefix="/api", tags=["Progress Tracking"])
app.include_router(resources.router, prefix="/api", tags=["Resources"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(video.router, prefix="/api", tags=["Video Generation"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Serve generated videos as static files
app.mount("/videos", StaticFiles(directory="generated_videos"), name="videos")


# ── Health Check ───────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "AI Learning Companion API",
        "version": "1.0.0",
    }
