from sqlalchemy import Column, Integer, String, Float, Date, Text
from .db import Base

class Weather(Base):
    __tablename__ = "weather"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    city = Column(String)
    temp = Column(Float)
    condition = Column(String)
    suggestion = Column(Text)