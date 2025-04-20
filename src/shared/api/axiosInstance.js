import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://eventcafe.site", // 기본 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // 필요 시 true
});

export default axiosInstance;
