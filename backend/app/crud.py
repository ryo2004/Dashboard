from sqlalchemy.orm import Session
from .models import Weather

def create_weather(db: Session, weather_data):
    db_weather = Weather(**weather_data)
    db.add(db_weather)
    db.commit()
    db.refresh(db_weather)
    return db_weather

def get_weather_by_date_city(db: Session, date, city):
    return db.query(Weather).filter_by(date=date, city=city).first()