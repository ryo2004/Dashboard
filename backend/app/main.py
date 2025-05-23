from fastapi import FastAPI
from app.api import weather

app = FastAPI()

app.include_router(weather.router)
