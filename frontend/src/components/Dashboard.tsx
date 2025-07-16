import React, { useState, useEffect, useRef } from 'react';
import { getUsernameFromToken, isTokenExpired } from '../utils/jwtUtils';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('User');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // コンポーネントマウント時にトークンからユーザー名を取得
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // トークンの有効期限をチェック
      if (isTokenExpired(token)) {
        // トークンが期限切れの場合はログアウト
        onLogout();
        return;
      }
      
      // トークンからユーザー名を取得
      const extractedUsername = getUsernameFromToken(token);
      setUsername(extractedUsername);
    }
  }, [onLogout]);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  // 外側クリック時にドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu" ref={dropdownRef}>
      <div className="user-avatar" onClick={toggleDropdown}>
        <div className="avatar-circle">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item username-item">
            {username}
          </div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item" onClick={handleLogout}>
            サインアウト
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;