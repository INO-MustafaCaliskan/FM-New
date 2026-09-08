import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const verifyToken = () => {
  const token = Cookies.get('accessToken');
  if (!token) return null;

  try {
    const securityKey = process.env.SECURITY_KEY;
    return jwt.verify(token, securityKey, { 
      algorithms: ['HS256'],
      ignoreNotBefore: false,
      clockTimestamp: Math.floor(Date.now() / 1000) + 10 // 10 saniye tolerans
    });
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const decodedToken = verifyToken();
  if (!decodedToken) return false;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

export const getJwtInfo = () => {
  const ck = cookies();
  const token = ck.get("accessToken");
  
  if (!token) return null;

  try {
    const securityKey = process.env.SECURITY_KEY;
    return jwt.verify(token.value, securityKey, { 
      algorithms: ['HS256'],
      ignoreNotBefore: false,
      clockTimestamp: Math.floor(Date.now() / 1000) + 10 // 10 saniye tolerans
    });
  } catch (error) {
    return null;
  }
};
