"""
Indian Language Mode route. Translates already-generated AI health response
text into the user's selected Indian language via Google Cloud Translation
API. Does not touch Gemini generation logic in any way.
"""
from fastapi import APIRouter, Depends

from models.models import User
from models.schemas import TranslateRequest, TranslateResponse
from utils.auth import get_current_user
from utils.translate import translate_texts

router = APIRouter(prefix="/api/translate", tags=["Indian Language Mode"])


@router.post("", response_model=TranslateResponse)
def translate(payload: TranslateRequest, current_user: User = Depends(get_current_user)):
    translated = translate_texts(payload.texts, payload.target_language)
    return TranslateResponse(translated_texts=translated)
