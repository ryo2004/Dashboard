from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.db import SessionLocal
from app.auth import get_password_hash
from app.models import User

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(user: UserCreate):
    db = SessionLocal()
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="ユーザー名は既に使われています")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    return {"message": "ユーザー登録が完了しました"}