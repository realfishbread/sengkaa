// src/api/dictionaryApi.js
import axios from 'axios';

const BASE_URL = 'https://eventcafe.site/user/dictionary';

export const fetchDictionaryList = async () => {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
};

export const fetchDictionaryItem = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/`);
  return response.data;
};

export const createDictionaryItem = async (data) => {
  const response = await axios.post(`${BASE_URL}/`, data);
  return response.data;
};

// 필요하면 수정/삭제도 여기에!
