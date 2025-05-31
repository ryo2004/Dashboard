from sqlalchemy import Column, Integer, String, Float, Date, Text, Time
from .db import Base

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
    time = Column(Integer, nullable=False)  # 6 or 12
    weather = Column(String)
    temp = Column(Float)
    suggestion = Column(Text)