"""
"Find Care Near Me" route. Given the user's browser geolocation, calls the
Google Places API (New) and returns nearby healthcare facilities.
"""
from fastapi import APIRouter, Depends

from models.models import User
from models.schemas import NearbyCareRequest, NearbyCareResponse
from utils.auth import get_current_user
from utils.places import find_nearby_care

router = APIRouter(prefix="/api/nearby-care", tags=["Find Care Near Me"])


@router.post("", response_model=NearbyCareResponse)
def nearby_care(
    payload: NearbyCareRequest, current_user: User = Depends(get_current_user)
):
    facilities = find_nearby_care(payload.latitude, payload.longitude)
    return NearbyCareResponse(facilities=facilities)
