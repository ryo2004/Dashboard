from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.db import SessionLocal
from app.models import Suggestion
from app.auth import get_current_user
from datetime import date

router = APIRouter()

class SuggestionCreate(BaseModel):
    time: int  # 6 or 12
    weather: str
    temp: float
    suggestion: str

@router.post("/suggestion")
def create_suggestion(data: SuggestionCreate, current_user: str = Depends(get_current_user)):
    db = SessionLocal()
    today = date.today()
    time = data.time

    suggestion = db.query(Suggestion).filter_by(
        user_id=current_user.id, date=today, time=time
    ).first()
    if suggestion:
        # 既存データを上書き
        suggestion.weather = data.weather
        suggestion.temp = data.temp
        suggestion.suggestion = data.suggestion
        db.commit()
        db.refresh(suggestion)
        db.close()
        return suggestion

    new_suggestion = Suggestion(
        user_id=current_user.id,
        date=today,
        time=data.time,
        weather=data.weather,
        temp=data.temp,
        suggestion=data.suggestion
    )
    db.add(new_suggestion)
    db.commit()
    db.refresh(new_suggestion)
    db.close()
    return new_suggestion