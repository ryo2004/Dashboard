from fastapi import APIRouter

router = APIRouter()

@router.get("/weather")
async def get_weather():
    return {"message": "天気情報のサンプル"}
