import axios from 'axios';

let loginModalCallback = null;

// ① 인스턴스 만들기
const axiosInstance = axios.create({
  baseURL: 'https://eventcafe.site',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const injectLoginModalHandler = (showLoginModal) => {
  loginModalCallback = showLoginModal;
};
// 하나의 인터셉터로 통합
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ 401 토큰 만료 → 재발급 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
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

    // ✅ 403 → 직접 모달 띄움
    if (error.response?.status === 403) {
      console.warn('403 발생 → 로그인 모달 호출됨');
      if (loginModalCallback) loginModalCallback();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
