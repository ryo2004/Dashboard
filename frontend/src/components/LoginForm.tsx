import React, { useState } from 'react';

const LoginForm: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;
  const endpoint = isLogin ? '/api/login' : '/api/signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'エラーが発生しました');
        return;
      }
      if (isLogin && data.access_token) {
        onLogin(data.access_token);
      } else if (!isLogin) {
        setIsLogin(true);
      }
    } catch {
      setError('通信エラー');
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