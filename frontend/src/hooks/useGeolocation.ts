import { useEffect, useState } from 'react';
import axios from 'axios';

type Location = {
  lat: number | null;
  lon: number | null;
  city?: string;
  region?: string;
  country?: string;
  error?: string;
};

export const useLocation = (): Location => {
  const [location, setLocation] = useState<Location>({
    lat: null,
    lon: null,
  });

  useEffect(() => {
    // Geolocation API（ブラウザ）
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        async (err) => {
          console.warn("Geolocation failed, fallback to IP", err.message);
          await fallbackToIP();
        }
      );
    } else {
      fallbackToIP();
    }

    async function fallbackToIP() {
      try {
        const res = await axios.get('http://ip-api.com/json/');
        setLocation({
          lat: res.data.lat,
          lon: res.data.lon,
          city: res.data.city,
          region: res.data.regionName,
          country: res.data.country,
        });
      } catch (e) {
        setLocation({
          lat: null,
          lon: null,
          error: '位置情報の取得に失敗しました',
        });
      }
    }
  }, []);

  return location;
};
