// src/api/dictionaryApi.js
import axiosInstance from '../../../shared/api/axiosInstance';
import axios from 'axios';


export const fetchDictionaryList = async () => {
  const response = await axios.get(`https://eventcafe.site/user/dictionary/`);
  return response.data;
};

export const fetchDictionaryItem = async (id) => {
  const response = await axios.get(
    `https://eventcafe.site/user/dictionary/${id}/`
  );
  return response.data;
};

export const createDictionaryItem = async (data) => {
  const response = await axiosInstance.post(
    `/user/dictionary/`,
    data
  );
  return response.data;
};

// ❤️ 좋아요 증가
export const likeDictionaryItem = async (id) => {
  const response = await axiosInstance.post(
    `/user/dictionary/${id}/like/`
  );
  return response.data;
};

// 👁 조회수 증가 (서버에서 자동 처리되는 경우, 생략 가능)
export const fetchDictionaryItemWithView = async (id) => {
  const response = await axios.get(
    `https://eventcafe.site/user/dictionary/dictionary/${id}/`
  );
  return response.data;
};

// 🔍 중복 확인 (term 이름)
export const checkTermExists = async (term) => {
  const response = await axiosInstance.get(
    `/user/dictionary/dictionary/check/`,
    {
      params: { term },
    }
  );
  return response.data.exists; // 응답 형식에 따라 조정!
};

// 👁 총 조회수
export const fetchTotalViews = async () => {
  const response = await axios.get(
    `https://eventcafe.site/user/dictionary/total_views/`
  );
  return response.data.total_views;
};

// ✏️ 수정하기
export const updateDictionaryItem = async (id, updatedData) => {
  const response = await axiosInstance.put(
    `/user/dictionary/${id}/`,
    updatedData
  );
  return response.data;
};

// 🗑 삭제하기
export const deleteDictionaryItem = async (id) => {
  const response = await axiosInstance.delete(
    `/user/dictionary/${id}/`
  );
  return response.data;
};
