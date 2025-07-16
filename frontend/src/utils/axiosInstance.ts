import axios from 'axios';
import { isTokenExpired } from './jwtUtils';

const instance = axios.create({
    timeout: 5000
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // トークンの有効期限をチェック
    if (isTokenExpired(token)) {
      // トークンが期限切れの場合はクリアしてログイン画面にリダイレクト
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Token expired'));
    }
    
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合はトークンをクリア
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;