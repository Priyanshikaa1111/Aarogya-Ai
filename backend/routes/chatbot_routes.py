"""
AI Health Chatbot route. Keeps chat history only within the current request
(the frontend re-sends history each time); nothing is persisted server-side.
"""
from fastapi import APIRouter, Depends

from models.models import User
from models.schemas import ChatRequest, ChatResponse
from utils.auth import get_current_user
from utils.gemini import generate_text, DISCLAIMER

router = APIRouter(prefix="/api/chatbot", tags=["Health Chatbot"])

SYSTEM_PREAMBLE = """You are a friendly, general health education chatbot. You answer \
questions about healthy eating, exercise, sleep, hydration, common illnesses, and healthy \
habits in simple, encouraging language. You NEVER diagnose conditions or prescribe \
medication. If asked something outside general wellness education, gently redirect the \
user back to health and wellness topics. Keep responses concise (3-6 sentences).
"""


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest, current_user: User = Depends(get_current_user)):
    history_text = "\n".join(
        f"{msg.role}: {msg.content}" for msg in payload.history[-10:]
    )
    prompt = (
        f"{SYSTEM_PREAMBLE}\n\nConversation so far:\n{history_text}\n\n"
        f"user: {payload.message}\nassistant:"
    )
    reply = generate_text(prompt)
    return ChatResponse(reply=reply, disclaimer=DISCLAIMER)
