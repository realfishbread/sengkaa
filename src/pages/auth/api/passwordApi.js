// src/pages/auth/api/passwordApi.js

import axios from "axios";



const BASE_URL = "https://eventcafe.site/user/auth";

export const sendResetEmail = (email) => {
  return axios.post(`${BASE_URL}/reset-password-request/`, { email });
};

export const verifyResetCode = (email, code) => {
  return axios.post(`${BASE_URL}/verify-reset-code/`, { email, code });
};

export const resetPassword = (email, password) => {
  return axios.post(`${BASE_URL}/reset-password/`, { email, password });
};
