// src/pages/KakaoRedirectPage.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import axios from 'axios';

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchKakaoUser = async () => {
      const code = new URL(window.location.href).searchParams.get('code');

      try {
        const res = await axios.get(
          `https://eventcafe.site/user/social/oauth/kakao/callback?code=${code}`
        );

        const { access, refresh, nickname, username, email, profile_image } = res.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem(
          'userInfo',
          JSON.stringify({ nickname, username, email, profile_image })
        );

        setUser({ nickname, username, email, profile_image });

        navigate('/'); // 홈으로 리디렉션
      } catch (err) {
        console.error('카카오 로그인 실패:', err);
        alert('카카오 로그인 실패');
        navigate('/login'); // 실패 시 로그인 페이지로
      }
    };

    fetchKakaoUser();
  }, [navigate, setUser]);

  return <div>🔄 로그인 중입니다...</div>;
};

export default KakaoRedirectPage;
