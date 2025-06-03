import React from 'react';
import { useNews } from '../hooks/useNews';

const NewsSection: React.FC = () => {
  const { news, loading, error } = useNews();

  return (
    <section className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">今日のニュース</h2>
      {loading && <p>ニュースを取得中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {news.map((item, idx) => (
          <li key={idx}>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsSection;