import React from 'react';

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">天気・ニュースダッシュボード</h1>
      <p className="text-sm">{today}</p>
    </header>
  );
};

export default Header;