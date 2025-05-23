import React from 'react';

const WeatherSection: React.FC = () => {
  // ダミーデータ（API連携は useWeather で後ほど）
  const weather = {
    temp: 22,
    condition: 'くもり',
    suggestion: '長袖シャツ＋羽織りがおすすめ',
  };

  return (
    <section className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">今日の天気</h2>
      <p>気温: {weather.temp}℃</p>
      <p>天気: {weather.condition}</p>
      <p className="mt-2 text-sm text-gray-700">服装の提案: {weather.suggestion}</p>
    </section>
  );
};

export default WeatherSection;