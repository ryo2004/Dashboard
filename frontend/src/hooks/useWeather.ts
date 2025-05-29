import { useEffect, useState } from 'react';
import { useLocation } from './useLocation';

type Weather = {
  temp: number | null;
  condition: string;
  suggestion: string;
  city?: string;
  hourlyData?: { time: string; temp: number; weather: string }[];
};

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather>({
    temp: null,
    condition: '',
    suggestion: '',
    hourlyData: [],
  });

  const location = useLocation();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setWeather({
        temp: null,
        condition: 'エラー',
        suggestion: 'エラー',
        hourlyData: [],
      });
      return;
    }

    if (location.lat == null || location.lon == null) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=ja`
    )
      .then((res) => res.json())
      .then(async (data) => {
        // 0,3,6,9,12,15,18,21,24時の気温・天気を抽出
        const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
        const hourlyData = hours.map((hour) => {
          // 24時は翌日の0時
          const item = data.list.find((d: any) => {
            const date = new Date(d.dt_txt);
            return hour === 24
              ? date.getHours() === 0 && date.getDate() !== new Date().getDate()
              : date.getHours() === hour;
          });
          return item
            ? {
                time: `${hour}時`,
                temp: Math.round(item.main.temp),
                weather: getWeatherIcon(item.weather[0].main),
              }
            : {
                time: `${hour}時`,
                temp: NaN,
                weather: '？',
              };
        });

        // summary生成は省略（必要なら従来通り）
        const prompt =
          `今日の天気と気温の流れは「${hourlyData
            .map((d) =>
              isNaN(d.temp)
                ? `${d.time}: データなし`
                : `${d.time}: ${d.weather}、${d.temp}度`
            )
            .join('、')}」です。` +
          '服装の提案、天気についての一言、推奨される持ち物、加えて体調管理や紫外線・花粉・熱中症・交通・洗濯など生活に役立つワンポイントアドバイスがあれば1文で日本語・プレーンテキスト・60文字以内で出力してください。';

        // Gemini APIへリクエスト
        const geminiRes = await fetch('/api/gemini/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: prompt }),
        });
        const geminiData = await geminiRes.json();
        const suggestion =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
          geminiData?.suggestion ||
          '提案取得エラー';

        setWeather({
          temp: data.list[0].main.temp,
          condition: data.list[0].weather[0].description,
          suggestion,
          city: data.city.name,
          hourlyData,
        });
      })
      .catch(() => {
        setWeather({
          temp: null,
          condition: 'エラー',
          suggestion: 'エラー',
          hourlyData: [],
        });
      });
  }, [location.lat, location.lon]);

  return weather;
};

// 天気コード→アイコン変換（簡易版）
function getWeatherIcon(main: string) {
  switch (main) {
    case 'Rain':
      return '☔';
    case 'Clouds':
      return '☁️';
    case 'Clear':
      return '☀️';
    case 'Snow':
      return '❄️';
    case 'Thunderstorm':
      return '⚡';
    case 'Drizzle':
      return '🌦';
    default:
      return '🌈';
  }
}