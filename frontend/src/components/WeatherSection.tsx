import React from 'react';
import { useWeather } from '../hooks/useWeather';
import WeatherChart from './WeatherChart';

const WeatherSection: React.FC = () => {
  const weather = useWeather();

  if (!weather.hourlyData || weather.hourlyData.length === 0) {
    return (
      <section className="card">
        <h2 className="weather-title">今日の気温推移</h2>
        <p className="weather-loading">気温データの取得中</p>
        <p className="weather-condition">天気: {weather.condition || '取得中...'}</p>
        <p className="weather-suggestion">一言: {weather.suggestion}</p>
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
    <section className="card">
      <h2 className="weather-title">今日の気温推移</h2>
      <div className="weather-chart-container">
        <WeatherChart data={chartData} currentIndex={nearestIndex} />
      </div>
      <p className="weather-suggestion">一言: {weather.suggestion}</p>
    </section>
  );
};

export default WeatherSection;