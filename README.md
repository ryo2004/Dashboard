# Weather & News Dashboard
天気・ニュース・服装提案を一括表示する実用的な情報アプリ。
AIを活用してニュースを自動要約し、天気に応じた服装を提案します。

## 主な機能
- 現在地の天気を取得し表示
- 天気に応じた服装を自動提案（例: 晴れ→薄手のシャツ）
- NewsAPIから最新のニュースを取得
- Gemini APIでニュースを自動要約

## 環境変数の設定

このプロジェクトは以下のAPIキーを必要とします：
- OpenWeather
- News API
- Gemini

※ `.env` ファイルはセキュリティのためGit管理されていません。 `.env.example` を参考に設定してください。

## 使用技術
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: FastAPI, Python, httpx
- API: OpenWeatherMap, NewsAPI, Gemini (LLM要約)
- Docker, docker-compose による開発環境統一

## 実行手順

1. `.env.example` を `.env` にコピーし、APIキーを記入

2. 以下のコマンドで起動：

## 作者
- Ryo
- GitHub: [ryo2004](https://github.com/ryo2004)
