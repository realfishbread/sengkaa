import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ① 인스턴스 만들기
const axiosInstance = axios.create({
  baseURL: 'https://eventcafe.site',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ② 요청 인터셉터: 매 요청 전에 토큰을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 저장해 둔 토큰 읽기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (accessToken 만료 시 → refresh로 재발급 & 재요청)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 + 토큰 만료면
    if (
      error.response?.status === 401 &&
      !originalRequest._retry // 무한루프 방지
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post('https://eventcafe.site/user/auth/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        // 헤더에 새로운 토큰 다시 설정
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // 💫 원래 요청 다시 보내기!
      } catch (refreshError) {
        console.error('⚠️ 리프레시 토큰 만료됨:', refreshError);
        localStorage.clear();
        window.location.href = '/login'; // 또는 navigate('/login')
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// shared/api/axiosInstance.js

export default axiosInstance;
