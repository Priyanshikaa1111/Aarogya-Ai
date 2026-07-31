"""
AI Diet Recommendation route. Collects basic body metrics and goal, then asks
Gemini to generate a simple calorie estimate and meal plan.
"""
from fastapi import APIRouter, Depends

from models.models import User
from models.schemas import DietRequest, DietResponse
from utils.auth import get_current_user
from utils.gemini import generate_json, DISCLAIMER

router = APIRouter(prefix="/api/diet-planner", tags=["Diet Planner"])

PROMPT_TEMPLATE = """You are a general wellness assistant, not a licensed dietitian. \
Based on the profile below, generate simple, general educational diet guidance. \
Do not give medical advice.

Age: {age}
Height: {height_cm} cm
Weight: {weight_kg} kg
Gender: {gender}
Diet preference: {diet_preference}
Goal: {goal}

Respond with ONLY a JSON object in exactly this shape, no extra text:
{{
  "daily_calorie_estimate": "a short sentence with an approximate daily calorie range",
  "meal_plan": ["breakfast suggestion", "lunch suggestion", "dinner suggestion", "snack suggestion"],
  "water_intake": "a short sentence with a recommended daily water intake",
  "lifestyle_tips": ["tip 1", "tip 2", "tip 3"]
}}

Keep it simple, encouraging, and beginner-friendly.
"""


@router.post("", response_model=DietResponse)
def get_diet_plan(payload: DietRequest, current_user: User = Depends(get_current_user)):
    prompt = PROMPT_TEMPLATE.format(
        age=payload.age,
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg,
        gender=payload.gender,
        diet_preference=payload.diet_preference,
        goal=payload.goal,
    )
    data = generate_json(prompt)

    return DietResponse(
        daily_calorie_estimate=data.get("daily_calorie_estimate", ""),
        meal_plan=data.get("meal_plan", []),
        water_intake=data.get("water_intake", ""),
        lifestyle_tips=data.get("lifestyle_tips", []),
        disclaimer=DISCLAIMER,
    )
