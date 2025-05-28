from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.crud import get_user_by_username, create_user
from app.auth import verify_password, create_access_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(username: str, password: str, db: Session = Depends(get_db)):
    if get_user_by_username(db, username):
        raise HTTPException(status_code=400, detail="Username already registered")
    user = create_user(db, username, password)
    return {"id": user.id, "username": user.username}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}