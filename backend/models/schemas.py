"""
Pydantic schemas used for request validation and response serialization.
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Symptom Checker ----------

class SymptomRequest(BaseModel):
    symptoms: str = Field(..., min_length=3, max_length=1000)


class SymptomResponse(BaseModel):
    possible_causes: List[str]
    explanation: str
    self_care_tips: List[str]
    see_doctor: str
    disclaimer: str


# ---------- Diet Recommendation ----------

class DietRequest(BaseModel):
    age: int = Field(..., gt=0, lt=120)
    height_cm: float = Field(..., gt=50, lt=250)
    weight_kg: float = Field(..., gt=10, lt=300)
    gender: str
    diet_preference: str
    goal: str


class DietResponse(BaseModel):
    daily_calorie_estimate: str
    meal_plan: List[str]
    water_intake: str
    lifestyle_tips: List[str]
    disclaimer: str


# ---------- Medicine Reminder ----------

class ReminderCreate(BaseModel):
    medicine_name: str = Field(..., min_length=1, max_length=100)
    dosage: str = Field(..., min_length=1, max_length=100)
    reminder_time: str = Field(..., description="Time in HH:MM 24-hour format")


class ReminderOut(BaseModel):
    id: int
    medicine_name: str
    dosage: str
    reminder_time: str
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReminderUpdate(BaseModel):
    is_completed: Optional[bool] = None


# ---------- Chatbot ----------

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    disclaimer: str


# ---------- Find Care Near Me ----------

class NearbyCareRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class NearbyFacility(BaseModel):
    name: str
    address: str
    rating: Optional[float] = None
    user_rating_count: Optional[int] = None
    open_now: Optional[bool] = None
    maps_url: str
    types: List[str] = []


class NearbyCareResponse(BaseModel):
    facilities: List[NearbyFacility]


# ---------- Indian Language Mode (Translation) ----------

class TranslateRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1, max_length=50)
    target_language: str = Field(..., min_length=2, max_length=10)


class TranslateResponse(BaseModel):
    translated_texts: List[str]
