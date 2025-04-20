import axios from "axios";

// ① 인스턴스 만들기
const axiosInstance = axios.create({
  baseURL: "https://eventcafe.site",
  headers: { "Content-Type": "application/json" },
});

// ② 요청 인터셉터: 매 요청 전에 토큰을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 저장해 둔 토큰 읽기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
