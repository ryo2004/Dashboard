import React from 'react';
import { useNews } from '../hooks/useNews';

const NewsSection: React.FC = () => {
  const { news, loading, error } = useNews();

  return (
    <section className="card">
      <h2 className="news-title">今日のニュース</h2>
      {loading && <p className="news-loading">ニュースを取得中...</p>}
      {error && <p className="news-error">{error}</p>}
      <ul className="news-list">
        {news.map((item, idx) => (
          <li key={idx} className="news-item">
            <h3 className="news-item-title">{item.title}</h3>
            <p className="news-item-summary">{item.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsSection;