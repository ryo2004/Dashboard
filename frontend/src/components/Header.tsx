import React from 'react';
import { useWeather } from '../hooks/useWeather';

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const weather = useWeather();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">天気・ニュースダッシュボード</h1>
      <p className="text-sm">
        {today}
        {weather.city ? `（${weather.city}）` : ''}
      </p>
    </header>
  );
};

export default Header;