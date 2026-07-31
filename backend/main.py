"""
AI Medical Assistant - FastAPI backend entrypoint.

Run with:
    uvicorn main:app --reload
"""
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from models import models  # noqa: F401  (ensures models are registered before create_all)
from routes import (
    auth_routes,
    symptom_routes,
    diet_routes,
    reminder_routes,
    chatbot_routes,
    care_routes,
    translate_routes,
)

load_dotenv()

# Create all tables on startup (fine for SQLite + a college project; use
# Alembic migrations for production apps).
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Medical Assistant API",
    description=(
        "Educational Generative AI medical assistant powered by Google Gemini. "
        "Not a substitute for professional medical advice."
    ),
    version="1.0.0",
)

cors_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(symptom_routes.router)
app.include_router(diet_routes.router)
app.include_router(reminder_routes.router)
app.include_router(chatbot_routes.router)
app.include_router(care_routes.router)
app.include_router(translate_routes.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "AI Medical Assistant API is running.",
        "docs": "/docs",
    }
