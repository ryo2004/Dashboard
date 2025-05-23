import React from 'react';
import { useWeather } from '../hooks/useWeather';

const WeatherSection: React.FC = () => {
  const weather = useWeather('Tokyo'); // 都市名はダミー

  return (
    <section className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">今日の天気</h2>
      <p>気温: {weather.temp !== null ? `${weather.temp}℃` : '取得中...'}</p>
      <p>天気: {weather.condition || '取得中...'}</p>
      <p className="mt-2 text-sm text-gray-700">服装の提案: {weather.suggestion}</p>
    </section>
  );
};

export default WeatherSection;