from fastapi import FastAPI
from app.api import weather, location, gemini

app = FastAPI()

app.include_router(weather.router)
app.include_router(location.router, prefix="/api")
app.include_router(gemini.router, prefix="/api")