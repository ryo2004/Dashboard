import React from 'react';
import { useWeather } from '../hooks/useWeather';
import WeatherChart from './WeatherChart';

const WeatherSection: React.FC = () => {
  const weather = useWeather();

  if (!weather.hourlyData || weather.hourlyData.length === 0) {
    return (
      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">今日の気温推移</h2>
        <p className="text-red-500">気温データの取得中</p>
        <p>天気: {weather.condition || '取得中...'}</p>
        <p className="mt-2 text-sm text-gray-700">服装の提案: {weather.suggestion}</p>
      </section>
    );
  }

  const chartData = weather.hourlyData;

  // 現在時刻に最も近いインデックスを計算
  const now = new Date();
  const hour = now.getHours();
  const nearestIndex = chartData.reduce((prev, curr, idx) => {
    const currHour = parseInt(curr.time);
    return Math.abs(currHour - hour) < Math.abs(parseInt(chartData[prev].time) - hour)
      ? idx
      : prev;
  }, 0);

  return (
    <section className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">今日の気温推移</h2>
      <div style={{ height: 300, width: 600, margin: '0 auto' }}>
        <WeatherChart data={chartData} currentIndex={nearestIndex} />
      </div>
      <p className="mt-2 text-sm text-gray-700">服装の提案: {weather.suggestion}</p>
    </section>
  );
};

export default WeatherSection;