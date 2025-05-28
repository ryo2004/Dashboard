import React from 'react';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">ダッシュボード</h2>
    <button
      className="bg-red-500 text-white px-4 py-2 rounded"
      onClick={onLogout}
    >
      ログアウト
    </button>
    {/* ここに天気やニュースなどのコンテンツを追加 */}
  </div>
);

export default Dashboard;