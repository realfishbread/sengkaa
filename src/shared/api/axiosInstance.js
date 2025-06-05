import axios from 'axios';

let loginModalCallback = null;
let navigateToLogin = null;





export const getLoginModalHandler = () => loginModalCallback; // ✅ 이 줄 추가!
export const injectLoginModalHandler = (callback) => {
  loginModalCallback = callback;
};

export const injectNavigateToLogin = (navigator) => {
  navigateToLogin = navigator;
};

const axiosInstance = axios.create({
  baseURL: 'https://eventcafe.site',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // 403 에러 처리
      if (error.response.status === 403) {
        const errorMessage = error.response.data?.detail || error.response.data?.message || '';
        const requiresAuth = error.response.data?.requires_auth;
        
        // 인증이 필요한 API인 경우에만 로그인 모달 표시
        if (requiresAuth) {
          if (typeof loginModalCallback === 'function') {
            loginModalCallback();
          }
          return Promise.reject(error);
        }
      }
      
      // 401 에러 처리
      if (error.response.status === 401) {
        const errorMessage = error.response.data?.detail || error.response.data?.message || '';
        if (errorMessage.includes('token') || 
            errorMessage.includes('인증') || 
            errorMessage.includes('authentication') ||
            errorMessage.includes('credentials')) {
          if (typeof loginModalCallback === 'function') {
            loginModalCallback();
          }
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
