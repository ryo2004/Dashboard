from fastapi import APIRouter, Request
import httpx

router = APIRouter()

@router.get("/location")
async def get_location(request: Request):
    forwarded_ip = request.headers.get("X-Forwarded-For")
    client_ip = forwarded_ip.split(",")[0] if forwarded_ip else request.client.host

    if client_ip in ["127.0.0.1", "::1"]:
        return {
            "lat": 35.682839,
            "lon": 139.759455,
            "city": "Tokyo",
            "region": "Tokyo",
            "country": "Japan",
            "error": "ローカルIPのため、デフォルトの東京を設定しました。",
        }

    async with httpx.AsyncClient() as client:
        res = await client.get(f"http://ip-api.com/json/{client_ip}")
        data = await res.json()
        return {
            "lat": data.get("lat"),
            "lon": data.get("lon"),
            "city": data.get("city"),
            "region": data.get("regionName"),
            "country": data.get("country"),
        }