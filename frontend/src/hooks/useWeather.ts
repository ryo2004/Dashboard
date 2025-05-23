import { useEffect, useState } from 'react';

type Weather = {
  temp: number | null;
  condition: string;
  suggestion: string;
};

export const useWeather = (city: string = 'Tokyo') => {
  const [weather, setWeather] = useState<Weather>({
    temp: null,
    condition: '',
    suggestion: '',
  });

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setWeather({
        temp: null,
        condition: 'エラー',
        suggestion: 'エラー',
      });
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ja`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temp: data.main.temp,
          condition: data.weather[0].description,
          suggestion: '長袖シャツ＋羽織りがおすすめ',
        });
      })
      .catch(() => {
        setWeather({
          temp: null,
          condition: 'エラー',
          suggestion: 'エラー',
        });
      });
  }, [city]);

  return weather;
};