import React from 'react';

const NewsSection: React.FC = () => {
  // ダミーデータ（API連携は useNews で後ほど）
  const newsItems = [
    {
      title: '気温が急上昇、熱中症に注意',
      summary: '本日は全国的に気温が上昇。こまめな水分補給を心がけましょう。',
    },
    {
      title: 'AI関連の新規規制、来年から施行へ',
      summary: '政府はAI規制に関する新法案を可決。企業への影響が懸念される。',
    },
  ];

  return (
    <section className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">今日のニュース</h2>
      <ul className="space-y-4">
        {newsItems.map((item, idx) => (
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