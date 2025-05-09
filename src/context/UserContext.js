// src/context/UserContext.js
import { createContext, useState, useEffect, useMemo } from "react";
import axiosInstance from "../shared/api/axiosInstance";   // axios 인스턴스

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [ready, setReady] = useState(false); // 로딩 플래그

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("userInfo");
    if (!token) {
      setUser(JSON.parse(savedUser)); // 바로 세팅
      setReady(true);
      return;
    }

    // 헤더는 인터셉터가 자동으로 추가!
    axiosInstance
      .get("/user/profile/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  // 재연산 억제용
  const value = useMemo(() => ({ user, setUser, ready }), [user, ready]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

