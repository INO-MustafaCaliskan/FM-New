'use server'
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export const getJwtInfo = () => {
  const ck = cookies();
  const token = ck.get("accessToken");
  console.log("token", token)
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

export const isUserAuthenticated = () => {
  const decodedToken = getJwtInfo();
  if (!decodedToken) return false;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};