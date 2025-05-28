from sqlalchemy import Column, Integer, String, Float, Date, Text
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
    user_id = Column(Integer)  # ユーザーごとに紐付ける場合