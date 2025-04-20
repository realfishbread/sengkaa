// src/pages/auth/api/passwordApi.js

import axios from "../../../shared/api/axiosInstance";



const BASE_URL = "https://eventcafe.site/user";

export const sendResetEmail = (email) => {
  return axios.post(`${BASE_URL}/reset-password-request/`, { email });
};

export const verifyResetCode = (email, code) => {
  return axios.post(`${BASE_URL}/verify-reset-code/`, { email, code });
};

export const resetPassword = (email, password) => {
  return axios.post(`${BASE_URL}/reset-password/`, { email, password });
};
