
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import SessionLocal
from app.auth import verify_password, create_access_token
from app.models import User

router = APIRouter()

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(user: UserLogin):
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.username == user.username).first()
        if not db_user:
            raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが違います")
        if not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが違います")
        token = create_access_token({"sub": user.username})
        return {"access_token": token, "token_type": "bearer"}
    finally:
        db.close()