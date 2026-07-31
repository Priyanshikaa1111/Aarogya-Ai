"""
Thin wrapper around the Google Cloud Translation API (v2) used by the
Indian Language Mode feature. Translates already-generated Gemini health
responses into the user's selected Indian language; never touches the
Gemini prompting/generation logic itself.
"""
import os

import requests
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

GOOGLE_TRANSLATE_API_KEY = os.getenv("GOOGLE_TRANSLATE_API_KEY")

TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"

# Supported Indian languages for the language selector (ISO 639-1 codes).
SUPPORTED_LANGUAGES = {"hi", "bn", "mr", "te", "ta", "gu", "kn", "ml", "pa"}


def translate_texts(texts: list[str], target_language: str) -> list[str]:
    """
    Translates a list of strings into target_language using Google Cloud
    Translation API. Raises HTTPException on any failure so the caller
    (the /api/translate route) can decide how to respond; the frontend
    falls back to the original English text if this errors out.
    """
    if target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400, detail=f"Unsupported target language: {target_language}"
        )

    if not GOOGLE_TRANSLATE_API_KEY or GOOGLE_TRANSLATE_API_KEY == "your_google_translate_api_key_here":
        raise HTTPException(
            status_code=500,
            detail=(
                "GOOGLE_TRANSLATE_API_KEY is not configured on the server. "
                "Add it to your .env file to enable Indian Language Mode."
            ),
        )

    params = {"key": GOOGLE_TRANSLATE_API_KEY}
    body = {"q": texts, "target": target_language, "format": "text"}

    try:
        response = requests.post(TRANSLATE_URL, params=params, json=body, timeout=10)
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502, detail=f"Google Translation API request failed: {exc}"
        )

    if response.status_code != 200:
        detail = response.text
        try:
            detail = response.json().get("error", {}).get("message", detail)
        except ValueError:
            pass
        raise HTTPException(
            status_code=502, detail=f"Google Translation API error: {detail}"
        )

    data = response.json()
    try:
        translations = data["data"]["translations"]
        return [item["translatedText"] for item in translations]
    except (KeyError, TypeError):
        raise HTTPException(
            status_code=502,
            detail="Google Translation API returned an unexpected response.",
        )
