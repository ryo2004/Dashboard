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
    let didSet = false;

    function setIfNotYet(loc: Location) {
      if (!didSet) {
        setLocation(loc);
        didSet = true;
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIfNotYet({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        async () => {
          await fallbackToIP();
        }
      );
    } else {
      fallbackToIP();
    }

    async function fallbackToIP() {
      try {
        const res = await axiosInstance.get('/api/location');
        setIfNotYet({
          lat: res.data.lat,
          lon: res.data.lon,
          city: res.data.city,
          region: res.data.region,
          country: res.data.country,
        });
      } catch (e) {
        setIfNotYet({
          lat: null,
          lon: null,
          error: '位置情報の取得に失敗しました',
        });
      }
    }
  }, []);

  return location;
};
