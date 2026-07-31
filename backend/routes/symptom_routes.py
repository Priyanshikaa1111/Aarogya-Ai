"""
AI Symptom Checker route. Sends the user's described symptoms to Gemini and
returns a structured, easy-to-understand educational response.
"""
from fastapi import APIRouter, Depends

from models.models import User
from models.schemas import SymptomRequest, SymptomResponse
from utils.auth import get_current_user
from utils.gemini import generate_json, DISCLAIMER

router = APIRouter(prefix="/api/symptom-checker", tags=["Symptom Checker"])

PROMPT_TEMPLATE = """You are a careful medical information assistant. A user describes their \
symptoms below. You must NOT diagnose any disease. Provide general, easy-to-understand \
educational information only.

User symptoms: "{symptoms}"

Respond with ONLY a JSON object in exactly this shape, no extra text:
{{
  "possible_causes": ["cause 1", "cause 2", "cause 3"],
  "explanation": "a short, simple 2-3 sentence explanation in plain language",
  "self_care_tips": ["tip 1", "tip 2", "tip 3"],
  "see_doctor": "one short sentence on whether and when to see a doctor"
}}

Keep language simple, calm, and beginner-friendly. Do not use medical jargon without \
explaining it. Do not mention that you are an AI in the body of the text.
"""


@router.post("", response_model=SymptomResponse)
def check_symptoms(
    payload: SymptomRequest, current_user: User = Depends(get_current_user)
):
    prompt = PROMPT_TEMPLATE.format(symptoms=payload.symptoms)
    data = generate_json(prompt)

    return SymptomResponse(
        possible_causes=data.get("possible_causes", []),
        explanation=data.get("explanation", ""),
        self_care_tips=data.get("self_care_tips", []),
        see_doctor=data.get("see_doctor", ""),
        disclaimer=DISCLAIMER,
    )
