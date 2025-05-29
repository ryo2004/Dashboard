from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import weather, location, gemini, auth, signup

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(location.router, prefix="/api")
app.include_router(gemini.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(signup.router, prefix="/api")