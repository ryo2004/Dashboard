# Weather & News Dashboard

天気・ニュース・服装提案を一括表示する実用的な情報ダッシュボード。  
AIを活用してニュースを自動要約し、天気に応じた服装を提案する統合型Webアプリケーションです。

## 主な機能

### 🌤️ 天気情報
- 現在地の天気を自動取得・表示
- 24時間の気温推移をグラフで可視化
- 天気に応じた服装提案（AI生成）

### 📰 ニュース表示
- GNewsから最新のニュースを自動取得
- Gemini APIによる自動要約で読みやすく
- コンテナ再起動時のリトライ機能で高い可用性

### 🔐 ユーザー認証
- JWT認証システム
- ユーザー登録・ログイン機能
- セキュアなトークン管理

### 📱 レスポンシブデザイン
- PC・タブレット・スマートフォン対応
- モダンなUIデザイン
- 直感的な操作性

## 技術スタック

### Frontend
- **React 19.1.0** - モダンなUIライブラリ
- **TypeScript** - 型安全性の確保
- **Vite** - 高速な開発環境
- **Chart.js** - 天気グラフの可視化
- **Axios** - HTTP通信ライブラリ

### Backend
- **FastAPI** - 高性能なPython Webフレームワーク
- **PostgreSQL** - リレーショナルデータベース
- **JWT** - 認証システム
- **httpx** - 非同期HTTP通信

### API・サービス
- **OpenWeatherMap API** - 天気情報取得
- **GNews API** - ニュース情報取得
- **Gemini API** - AI要約・服装提案

### インフラ
- **Docker & Docker Compose** - 開発環境統一
- **uvicorn** - ASGI Webサーバー

## 環境変数の設定

### Root環境変数 (`/.env`)
```
# Database settings
POSTGRES_USER=dashboard_user
POSTGRES_PASSWORD=dashboard_password
POSTGRES_DB=dashboard
```

### Frontend環境変数 (`frontend/.env`)
```
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

### Backend環境変数 (`backend/.env`)
```
GNEWS_API_KEY=your_gnews_api_key
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
```

> **注意**: `.env` ファイルはセキュリティのためGit管理されていません。  
> `.env.example` を参考に適切なAPIキーを設定してください。

## 実行手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/ryo2004/Dashboard.git
cd Dashboard
```

### 2. 環境変数の設定
```bash
# Root directory
cp .env.example .env
# Frontend
cp frontend/.env.example frontend/.env
# Backend
cp backend/.env.example backend/.env
```

各`.env`ファイルに必要なAPIキーとデータベース設定を記入してください。

### 3. アプリケーションの起動
```bash
docker-compose up -d
```

### 4. アクセス
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## API仕様

### 認証エンドポイント
- `POST /api/signup` - ユーザー登録
- `POST /api/login` - ログイン

### データ取得エンドポイント
- `GET /api/weather` - 天気情報取得
- `GET /api/news` - ニュース一覧取得
- `POST /api/gemini/summary` - AI要約生成

## 開発者向け情報

### ディレクトリ構成
```
Dashboard/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/   # Reactコンポーネント
│   │   ├── hooks/        # カスタムフック
│   │   ├── styles/       # CSSファイル
│   │   └── utils/        # ユーティリティ
│   └── Dockerfile
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/         # APIエンドポイント
│   │   ├── models.py    # データモデル
│   │   ├── auth.py      # 認証ロジック
│   │   └── main.py      # アプリケーションエントリポイント
│   └── Dockerfile
└── compose.yaml       # Docker Compose設定
```

### 主要な機能実装

#### リトライ機能
API呼び出しの信頼性向上のため、エクスポネンシャルバックオフ付きのリトライ機能を実装：
- 最大3回のリトライ
- 1秒、2秒、4秒の間隔
- コンテナ再起動時の安定性向上

#### JWT認証
- セキュアなトークン管理
- 自動ログアウト機能
- ユーザー情報の永続化

## トラブルシューティング

### よくある問題

1. **APIキーエラー**
   - 各APIキーが正しく設定されているか確認
   - APIキーの有効期限・使用制限を確認

2. **コンテナ起動エラー**
   - Docker Desktopが起動しているか確認
   - ポート3000, 8000が使用されていないか確認

3. **データベース接続エラー**
   - データベースコンテナが正常に起動しているか確認
   - 初回起動時はデータベース初期化に時間がかかる場合があります

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 作者

**Ryo**
- GitHub: [@ryo2004](https://github.com/ryo2004)
- 開発期間: 2025年7月

---

## 更新履歴

### v1.0.0 (2025/07/16)
- 初期リリース
- 天気情報・ニュース表示機能
- JWT認証システム
- レスポンシブデザイン対応
- APIリトライ機能実装
