from app.db import engine, Base
from app import models  # これを追加

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)