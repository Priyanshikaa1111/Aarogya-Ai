"""
Medicine Reminder CRUD routes, backed by SQLite.
"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.db import get_db
from models.models import MedicineReminder, User
from models.schemas import ReminderCreate, ReminderOut, ReminderUpdate
from utils.auth import get_current_user

router = APIRouter(prefix="/api/reminders", tags=["Medicine Reminders"])


@router.get("", response_model=List[ReminderOut])
def list_reminders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return (
        db.query(MedicineReminder)
        .filter(MedicineReminder.user_id == current_user.id)
        .order_by(MedicineReminder.reminder_time)
        .all()
    )


@router.post("", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
def create_reminder(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = MedicineReminder(
        user_id=current_user.id,
        medicine_name=payload.medicine_name,
        dosage=payload.dosage,
        reminder_time=payload.reminder_time,
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


@router.patch("/{reminder_id}", response_model=ReminderOut)
def update_reminder(
    reminder_id: int,
    payload: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = (
        db.query(MedicineReminder)
        .filter(
            MedicineReminder.id == reminder_id,
            MedicineReminder.user_id == current_user.id,
        )
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found.")

    if payload.is_completed is not None:
        reminder.is_completed = payload.is_completed

    db.commit()
    db.refresh(reminder)
    return reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = (
        db.query(MedicineReminder)
        .filter(
            MedicineReminder.id == reminder_id,
            MedicineReminder.user_id == current_user.id,
        )
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found.")

    db.delete(reminder)
    db.commit()
    return None
