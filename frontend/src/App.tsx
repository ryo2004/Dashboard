import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import WeatherSection from './components/WeatherSection';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { isTokenExpired } from './utils/jwtUtils';
import './styles/App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // アプリ起動時にトークンの有効期限をチェック
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenExpired(storedToken)) {
      // トークンが期限切れの場合はクリア
      localStorage.removeItem('token');
      setToken('');
    }
  }, []);

  const handleLogin = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            token ? (
              <>
                <div className="header-section">
                  <Header />
                  <div className="dashboard-controls">
                    <Dashboard onLogout={handleLogout} />
                  </div>
                </div>
                <div className="main-content">
                  <div className="weather-section">
                    <WeatherSection />
                  </div>
                  <div className="news-section">
                    <NewsSection />
                  </div>
                </div>
                <div className="footer-section">
                  <Footer />
                </div>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;