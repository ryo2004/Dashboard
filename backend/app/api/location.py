from fastapi import APIRouter, Request
import httpx

router = APIRouter()

@router.get("/location")
async def get_location(request: Request):
    client_ip = request.client.host
    async with httpx.AsyncClient() as client:
        res = await client.get(f"http://ip-api.com/json/{client_ip}")
        data = res.json()
        return {
            "lat": data.get("lat"),
            "lon": data.get("lon"),
            "city": data.get("city"),
            "region": data.get("regionName"),
            "country": data.get("country"),
        }