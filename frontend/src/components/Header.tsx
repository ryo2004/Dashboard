import React from 'react';
import { useWeather } from '../hooks/useWeather';

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const weather = useWeather();

  return (
    <header className="header">
      <h1 className="header-title">天気・ニュースダッシュボード</h1>
      <p className="header-date">
        {today}
        {weather.city ? `（${weather.city}）` : ''}
      </p>
    </header>
  );
};

export default Header;