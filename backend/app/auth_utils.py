from fastapi import Depends
from app.models import User

def get_current_user():
    # ダミー実装（本番は認証処理を書く）
    return User(id=1, username="dummy", hashed_password="dummy")