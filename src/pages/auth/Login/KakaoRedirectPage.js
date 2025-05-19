import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // 🔁 쿼리스트링에서 토큰 꺼내기
    const params = new URL(window.location.href).searchParams;
    const access = params.get('access');
    const refresh = params.get('refresh');
    const nickname = params.get('nickname');
    const username = params.get('username');
    const profile_image = params.get("profile_image") || params.get("profile_image_url");

    if (access && refresh) {
      // 🔐 저장
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ nickname, username, profile_image })
      );

      setUser({ nickname, username, profile_image });
      navigate('/'); // 홈으로 이동
    } else {
      alert('카카오 로그인 실패: 토큰 없음');
      navigate('/login');
    }
  }, [navigate, setUser]);

  return <div>🔄 로그인 중입니다...</div>;
};

export default KakaoRedirectPage;
