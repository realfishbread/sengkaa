import axios from 'axios';

let loginModalCallback = null;

export const getLoginModalHandler = () => loginModalCallback;

let navigateToLogin = null;
export const injectNavigateToLogin = (navigator) => {
  navigateToLogin = navigator;
};
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

    if (error.response?.status === 403) {
      // 인증이 필요한 API에 대한 접근 시 로그인 모달 표시
      if (error.response?.data?.detail === 'Authentication credentials were not provided.' ||
          error.response?.data?.detail === 'Invalid token.' ||
          error.response?.data?.detail === 'Token has expired.' ||
          error.response?.data?.detail === 'You do not have permission to perform this action.') {
        if (typeof loginModalCallback === 'function') {
          loginModalCallback();
        }
        if (typeof navigateToLogin === 'function') {
          navigateToLogin('/login', { state: { backgroundLocation: window.location } });
        }
      } else {
        // 권한 부족 에러의 경우 사용자에게 알림
        console.error('권한이 없습니다:', error.response?.data?.detail);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
