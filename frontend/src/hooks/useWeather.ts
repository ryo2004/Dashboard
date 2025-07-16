import { useEffect, useState } from 'react';
import { useLocation } from './useLocation';

type Weather = {
  temp: number | null;
  condition: string;
  suggestion: string;
  city?: string;
  hourlyData?: { time: string; temp: number; weather: string }[];
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather>({
    temp: null,
    condition: '',
    suggestion: '',
    hourlyData: [],
  });

  const location = useLocation();

  const fetchWeatherWithRetry = async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // 1秒、2秒、4秒

    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeather API key is not configured');
      }

      if (location.lat == null || location.lon == null) {
        throw new Error('Location data is not available');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=ja`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

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

      // summary生成
      const prompt =
        `今日の天気と気温の流れは「${hourlyData
          .map((d) =>
            isNaN(d.temp)
              ? `${d.time}: データなし`
              : `${d.time}: ${d.weather}、${d.temp}度`
          )
          .join('、')}」です。` +
        '天気についての一言、推奨される持ち物、加えて体調管理や紫外線・花粉・熱中症・交通・洗濯など生活に役立つワンポイントアドバイスがあれば1文で日本語・プレーンテキスト・60文字以内で出力してください。';

      let suggestion = '提案を取得中...';
      
      try {
        // Gemini APIへリクエスト（リトライ付き）
        const geminiRes = await fetch('/api/gemini/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: prompt }),
        });
        
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          suggestion =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            geminiData?.suggestion ||
            '今日も良い一日をお過ごしください。';
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        suggestion = '今日も良い一日をお過ごしください。';
      }

      setWeather({
        temp: data.list[0].main.temp,
        condition: data.list[0].weather[0].description,
        suggestion,
        city: data.city.name,
        hourlyData,
      });
    } catch (error) {
      console.error(`Weather fetch attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < maxRetries) {
        console.log(`Retrying weather fetch in ${retryDelay}ms...`);
        await delay(retryDelay);
        return fetchWeatherWithRetry(retryCount + 1);
      } else {
        // デフォルトデータを設定
        setWeather({
          temp: null,
          condition: '天気情報を取得中...',
          suggestion: '天気情報の取得に時間がかかっています。',
          hourlyData: [],
        });
      }
    }
  };

  useEffect(() => {
    if (location.lat != null && location.lon != null) {
      fetchWeatherWithRetry();
    }
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
