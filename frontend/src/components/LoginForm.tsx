
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const LoginForm: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const endpoint = isLogin ? '/api/login' : '/api/signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axiosInstance.post(endpoint, { username, password });
      const data = res.data;
      
      if (isLogin && (data.access_token || data.token)) {
        const token = data.access_token || data.token;
        onLogin(token);
        navigate('/');
      } else if (!isLogin) {
        setIsLogin(true);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('通信エラー');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">{isLogin ? 'ログイン' : '新規登録'}</h2>
        <input
          className="form-input"
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="form-error">{error}</div>}
        <button 
          className="form-submit" 
          type="submit"
          disabled={!username || !password}
        >
          {isLogin ? 'ログイン' : '登録'}
        </button>
        <button
          type="button"
          className="form-toggle"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? '新規登録はこちら' : 'ログイン画面へ'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;