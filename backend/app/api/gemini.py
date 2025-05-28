from fastapi import APIRouter, Body
import httpx
import os

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@router.post("/gemini/summary")
async def summarize(text: str = Body(..., embed=True)):
    # Gemini APIへのリクエスト例（実際のAPI仕様に合わせて修正）
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            params={"key": GEMINI_API_KEY},
            json={
                "contents": [{"parts": [{"text": text}]}]
            }
        )
        return res.json()