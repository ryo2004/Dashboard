import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  summary: string;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsWithRetry = async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // 1秒、2秒、4秒

    try {
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setNews(data);
      } else if (Array.isArray(data.news)) {
        setNews(data.news);
      } else if (data.message) {
        setNews([{ title: 'お知らせ', summary: data.message }]);
      } else {
        setNews([]);
      }
      
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error(`News fetch attempt ${retryCount + 1} failed:`, err);
      
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await delay(retryDelay);
        return fetchNewsWithRetry(retryCount + 1);
      } else {
        // 最大リトライ回数に達した場合はデフォルトニュースを表示
        setNews([
          { 
            title: 'ニュース取得中...', 
            summary: 'ニュースの取得に時間がかかっています。しばらくお待ちください。' 
          }
        ]);
        setError(`ニュースの取得に失敗しました (${maxRetries + 1}回試行)`);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNewsWithRetry();
  }, []);

  return { news, loading, error };
};