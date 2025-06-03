from fastapi import APIRouter, Depends
import httpx
import os
from datetime import datetime, time
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User, NewsCache  # NewsCacheモデルを作成しておく必要あり
from app.auth_utils import get_current_user  # 認証用のDepends

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

# 更新タイミング（5時、12時、18時）
UPDATE_HOURS = [5, 12, 18]

def get_update_key():
    now = datetime.now()
    # 直近の更新時刻を求める
    hour = max([h for h in UPDATE_HOURS if now.hour >= h], default=UPDATE_HOURS[0])
    return now.date().isoformat() + f"-{hour}"

@router.get("/news")
async def get_news(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    update_key = get_update_key()
    # ユーザーごとのキャッシュを検索
    cache: NewsCache = (
        db.query(NewsCache)
        .filter_by(user_id=user.id, update_key=update_key)
        .first()
    )
    if cache and cache.data:
        return cache.data

    try:
        async with httpx.AsyncClient() as client:
            gnews_res = await client.get(
                f"https://gnews.io/api/v4/top-headlines?lang=ja&token={GNEWS_API_KEY}"
            )
            gnews_data = gnews_res.json()
            articles = gnews_data.get("articles", [])[:5]

            summarized = []
            for article in articles:
                title = article.get("title", "")
                content = article.get("description") or ""
                prompt = f"次のニュースを日本語で1文に要約してください: {title} {content}"
                gemini_res = await client.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                    params={"key": GEMINI_API_KEY},
                    json={"contents": [{"parts": [{"text": prompt}]}]}
                )
                gemini_data = gemini_res.json()
                summary = gemini_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                summarized.append({"title": title, "summary": summary})

            # キャッシュ保存
            if cache:
                cache.data = summarized
                cache.updated_at = datetime.now()
            else:
                cache = NewsCache(
                    user_id=user.id,
                    update_key=update_key,
                    data=summarized,
                    updated_at=datetime.now()
                )
                db.add(cache)
            db.commit()

            return summarized
    except Exception as e:
        return {"error": str(e)}