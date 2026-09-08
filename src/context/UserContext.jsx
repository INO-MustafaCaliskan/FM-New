"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import client from '@/utils/client';
import { SignIn, SignOut, SignInOAuth } from "@/utils/authActions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // token yoksa false zaten
  // Store token in state so that changes (e.g., after login) trigger re‑render
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await client.get("/User/GetLoginUserInfo");
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        
        const cookieTimeZone = Cookies.get("timeZone");
        if (userData.timeZone !== cookieTimeZone || !cookieTimeZone) {
          Cookies.set("timeZone", userData.timeZone);
        }
      }
    } catch (error) {
      console.log(error);
      const ac = Cookies.get('accessToken');
      setUser(parseUserFromToken(ac));
    } finally {
      setLoading(false);
    }
  }, []); // bağımlılık yok

  // method : "email" | "oauth"
  // payload : {email, password, rememberMe, idToken, code, provider}
  // email login için email ve password, google login için code yada idToken gerekli.
  // @react-oauth/google paketi popup ve one-tap seçiminde jwt veriyor, redirect seçiminde code veriyor.
  const login = async (method = "email", {email, password, rememberMe, idToken, code, provider}) => {
    let loginResult;
    if(method === "email"){
      loginResult = await SignIn(email, password, rememberMe || false);
    }else if(method === "oauth"){
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      loginResult = await SignInOAuth({code : code, idToken : idToken, timeZone, provider});
    }else{
      throw new Error("Unsupported login provider.");
    }
    
    if (loginResult.success && loginResult.data?.accessToken) {
      const newToken = loginResult.data.accessToken;
      // setUser(parseUserFromToken(newToken));

      // Token'ları güncelle
      setToken(newToken);
      setSessionId(loginResult.data.sessionId);
      await fetchUser();
    }

    return loginResult;
  };

  const logout = useCallback(async () => {
    await SignOut();
    setUser(null);
    setToken(null);
    setSessionId(null);
  }, []);

  const refreshUser = useCallback(() => fetchUser(), [fetchUser]);

  useEffect(() => {
    const ac = Cookies.get('accessToken');
    const sid = Cookies.get('sessionId');
    if(ac && sid){
      setToken(ac);
      setSessionId(sid);
      fetchUser();
    }else{
      setLoading(false);
    }

  }, []); // sadece mount'ta çalışır

  return (
    <UserContext.Provider value={{ user, token, sessionId, loading, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// JWT'den user parse et — API bekleme
const parseUserFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return null;
    const splittedName = decoded?.name?.split(" ") || ["no", "name"];
    return {
      ...decoded,
      firstName: splittedName[0],
      lastName: splittedName[1],
      _fromJwt: true, // API'den henüz güncellenmedi işareti
    };
  } catch {
    return null;
  }
};



