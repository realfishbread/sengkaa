// 📁 login-success.js (프론트에서 라우팅 처리)

import React, { useEffect } from "react";
const LoginSuccess = () => {
    useEffect(() => {
      const query = new URLSearchParams(window.location.search);
      const access = query.get("access");
      const refresh = query.get("refresh");

      if (!access || !refresh) {
        alert("로그인 토큰이 유효하지 않습니다.");
        window.location.href = "/login";
      }
  
      if (access && refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        alert("소셜 로그인 성공! 🎉");
        window.location.href = "/"; // 홈으로 이동
      }
    }, []);
    return (
        <div style={{ textAlign: "center", paddingTop: "3rem" }}>
          <p>로그인 처리 중입니다... ⏳</p>
        </div>
      );
    };
    
    export default LoginSuccess;