
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
      if (isLogin && data.access_token) {
        onLogin(data.access_token);
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
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">{isLogin ? 'ログイン' : '新規登録'}</h2>
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        {isLogin ? 'ログイン' : '登録'}
      </button>
      <button
        type="button"
        className="text-blue-600 mt-2 underline w-full"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? '新規登録はこちら' : 'ログイン画面へ'}
      </button>
    </form>
  );
};

export default LoginForm;