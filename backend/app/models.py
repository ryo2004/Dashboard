from sqlalchemy import Column, Integer, String, Float, Date, Text, Time, DateTime, JSON
from sqlalchemy.orm import relationship
from .db import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Weather(Base):
    __tablename__ = "weather"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    city = Column(String)
    temp = Column(Float)
    condition = Column(String)
    suggestion = Column(Text)
    user_id = Column(Integer)

class Suggestion(Base):
    __tablename__ = "suggestions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Integer, nullable=False) 
    weather = Column(String)
    temp = Column(Float)
    suggestion = Column(Text)

class NewsCache(Base):
    __tablename__ = "news_cache"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    update_key = Column(String, index=True)
    data = Column(JSON)
    updated_at = Column(DateTime, default=datetime.utcnow)