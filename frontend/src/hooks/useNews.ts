import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  summary: string;
};

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        } else if (Array.isArray(data.news)) {
          setNews(data.news);
        } else if (data.message) {
          setNews([{ title: 'お知らせ', summary: data.message }]);
        } else {
          setNews([]);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError('ニュースの取得に失敗しました');
        setLoading(false);
      });
  }, []);

  return { news, loading, error };
};