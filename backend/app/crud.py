from sqlalchemy.orm import Session
from .models import User, Weather
from .auth import get_password_hash

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, password: str):
    hashed_password = get_password_hash(password)
    db_user = User(username=username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_weather(db: Session, weather_data):
    db_weather = Weather(**weather_data)
    db.add(db_weather)
    db.commit()
    db.refresh(db_weather)
    return db_weather

def get_weather_by_date_city(db: Session, date, city):
    return db.query(Weather).filter_by(date=date, city=city).first()