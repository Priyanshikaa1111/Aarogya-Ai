"""
Thin wrapper around the Google Places API (New) used by the
"Find Care Near Me" feature on the Symptom Checker page.
"""
import os

import requests
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

SEARCH_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby"

# Field mask keeps the response small and only requests what we use.
FIELD_MASK = ",".join(
    [
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.currentOpeningHours.openNow",
        "places.googleMapsUri",
        "places.types",
    ]
)

# Types of nearby places we consider "healthcare" for this feature.
INCLUDED_TYPES = ["hospital", "doctor", "pharmacy", "medical_lab"]

SEARCH_RADIUS_METERS = 5000
MAX_RESULTS = 5


def find_nearby_care(latitude: float, longitude: float) -> list[dict]:
    """
    Calls Google Places API (New) Nearby Search and returns a list of nearby
    healthcare facilities (hospitals, doctors, pharmacies, clinics).
    """
    if not GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API_KEY == "your_google_maps_api_key_here":
        raise HTTPException(
            status_code=500,
            detail=(
                "GOOGLE_MAPS_API_KEY is not configured on the server. "
                "Add it to your .env file to enable Find Care Near Me."
            ),
        )

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }
    body = {
        "includedTypes": INCLUDED_TYPES,
        "maxResultCount": MAX_RESULTS,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": latitude, "longitude": longitude},
                "radius": SEARCH_RADIUS_METERS,
            }
        },
    }

    try:
        response = requests.post(
            SEARCH_NEARBY_URL, headers=headers, json=body, timeout=10
        )
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502, detail=f"Google Places API request failed: {exc}"
        )

    if response.status_code != 200:
        detail = response.text
        try:
            detail = response.json().get("error", {}).get("message", detail)
        except ValueError:
            pass
        raise HTTPException(
            status_code=502, detail=f"Google Places API error: {detail}"
        )

    data = response.json()
    places = data.get("places", [])

    facilities = []
    for place in places:
        opening_hours = place.get("currentOpeningHours") or {}
        facilities.append(
            {
                "name": place.get("displayName", {}).get("text", "Unknown"),
                "address": place.get("formattedAddress", "Address not available"),
                "rating": place.get("rating"),
                "user_rating_count": place.get("userRatingCount"),
                "open_now": opening_hours.get("openNow"),
                "maps_url": place.get(
                    "googleMapsUri",
                    f"https://www.google.com/maps/search/?api=1&query={latitude},{longitude}",
                ),
                "types": place.get("types", []),
            }
        )

    return facilities
