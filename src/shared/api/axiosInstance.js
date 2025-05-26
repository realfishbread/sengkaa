import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

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

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 403) {
      const currentUrl = window.location.pathname + window.location.search;

      // ❗ 페이지 전환 시 backgroundLocation으로 현재 페이지 기억시킴
      history.push('/login', {
        backgroundLocation: {
          pathname: currentUrl,
        },
      });
    }
    return Promise.reject(error);
  }
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
        const res = await axiosInstance.post('/user/auth/refresh/', {
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
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// shared/api/axiosInstance.js

export default axiosInstance;
