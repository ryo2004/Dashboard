// JWT トークンをデコードしてユーザー情報を取得するユーティリティ

interface JWTPayload {
  sub: string; // ユーザーID
  username?: string; // ユーザー名
  exp: number; // 有効期限
  iat: number; // 発行時刻
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWTトークンは3つの部分がピリオドで区切られている
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // ペイロード部分（2番目の部分）をデコード
    const payload = parts[1];
    
    // Base64URLデコード
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // JSONパース
    const parsed = JSON.parse(decoded);
    
    return parsed as JWTPayload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

export const getUsernameFromToken = (token: string): string => {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return 'User';
  }
  
  // ユーザー名がある場合はそれを返す、なければsubを使用
  return payload.username || payload.sub || 'User';
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return true;
  }
  
  // 現在時刻と有効期限を比較
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};
