"""
Thin wrapper around the Google Gemini API used across the medical assistant
features (symptom checker, diet planner, chatbot).

Uses the current Google Gen AI SDK (`google-genai`). The old
`google.generativeai` SDK used in the original project was retired by
Google on Nov 30, 2025 and its own dependencies (grpcio/protobuf pins)
don't ship Python 3.14 wheels, so it can't be installed cleanly anymore.
"""
import json
import os
import re

from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# gemini-2.0-flash (used by the original project) was shut down by Google
# on June 1, 2026. gemini-3.1-flash-lite is its closest low-cost/low-latency
# successor and has no announced shutdown date as of this writing. Override
# with GEMINI_MODEL in .env if you want a different model (e.g. gemini-3.5-flash).
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

DISCLAIMER = (
    "This information is AI-generated and is for educational purposes only. "
    "Please consult a qualified healthcare professional for medical advice."
)

_client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    _client = genai.Client(api_key=GEMINI_API_KEY)


def _get_client() -> genai.Client:
    if _client is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "GEMINI_API_KEY is not configured on the server. "
                "Add it to your .env file to enable AI features."
            ),
        )
    return _client


def generate_json(prompt: str) -> dict:
    """
    Sends a prompt to Gemini and expects a strict JSON object back.
    Strips markdown code fences if the model wraps the JSON in them.
    """
    client = _get_client()
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        text = (response.text or "").strip()
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Gemini API request failed: {exc}"
        )

    # Defensive cleanup in case the model still wraps output in code fences.
    text = re.sub(r"^```(json)?|```$", "", text.strip(), flags=re.MULTILINE).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="Gemini returned a response that could not be parsed as JSON.",
        )


def generate_text(prompt: str) -> str:
    """Sends a prompt to Gemini and returns plain text."""
    client = _get_client()
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        return (response.text or "").strip()
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Gemini API request failed: {exc}"
        )
