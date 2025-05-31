from fastapi import APIRouter, Body
import httpx
import os

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@router.post("/gemini/summary")
async def summarize(text: str = Body(..., embed=True)):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            params={"key": GEMINI_API_KEY},
            json={
                "contents": [{"parts": [{"text": text}]}]
            }
        )
        return res.json()