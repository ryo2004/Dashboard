from fastapi import APIRouter
import httpx
import os

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@router.get("/news")
async def get_news():
    try:
        async with httpx.AsyncClient() as client:
            # NewsAPIからトップニュース取得
            news_res = await client.get(
                f"https://newsapi.org/v2/top-headlines?country=jp&apiKey={NEWS_API_KEY}"
            )
            news_data = await news_res.json()
            articles = news_data.get("articles", [])[:5]

            summarized = []
            for article in articles:
                title = article.get("title", "")
                content = article.get("description") or article.get("content") or ""
                prompt = f"次のニュースを日本語で1文に要約してください: {title} {content}"
                gemini_res = await client.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                    params={"key": GEMINI_API_KEY},
                    json={"contents": [{"parts": [{"text": prompt}]}]}
                )
                gemini_data = await gemini_res.json()
                summary = gemini_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                summarized.append({"title": title, "summary": summary})

            return summarized
    except Exception as e:
        # エラー内容を返す
        return {"error": str(e)}