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
    async function fetchByIP() {
      try {
        const res = await axios.get('/api/location');
        setLocation({
          lat: res.data.lat,
          lon: res.data.lon,
          city: res.data.city,
          region: res.data.region,
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
    fetchByIP();
  }, []);

  return location;
};
