import axios from 'axios';

let loginModalCallback = null;

// ① 인스턴스 만들기
const axiosInstance = axios.create({
  baseURL: 'https://eventcafe.site',
  headers: { 'Content-Type': 'application/json' },
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

export const injectLoginModalHandler = (showLoginModal) => {
  loginModalCallback = showLoginModal;
};
// 하나의 인터셉터로 통합
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ 401 토큰 만료 → 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axiosInstance.post('/user/auth/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('⚠️ 리프레시 토큰 만료됨:', refreshError);
        localStorage.clear();
        if (loginModalCallback) loginModalCallback(); // ✅ 여기서 모달 띄우기
        return Promise.reject(refreshError);
      }
    }

    console.log('📌 loginModalCallback 존재함?', loginModalCallback);
    if (error.response?.status === 403) {
      if (typeof loginModalCallback === 'function') {
        loginModalCallback();
      } else {
        console.warn('❌ loginModalCallback이 아직 없음');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
