import { useEffect, useState } from 'react';
import { useLocation } from './useLocation';

type Weather = {
  temp: number | null;
  condition: string;
  suggestion: string;
  city?: string;
};

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather>({
    temp: null,
    condition: '',
    suggestion: '',
  });

  const location = useLocation();

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

    if (location.lat == null || location.lon == null) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=ja`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temp: data.main.temp,
          condition: data.weather[0].description,
          suggestion: '長袖シャツ＋羽織りがおすすめ',
          city: data.name, 
        });
      })
      .catch(() => {
        setWeather({
          temp: null,
          condition: 'エラー',
          suggestion: 'エラー',
        });
      });
  }, [location.lat, location.lon]);

  return weather;
};