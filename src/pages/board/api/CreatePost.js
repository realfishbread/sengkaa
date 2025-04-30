// src/api/postApi.js
import axiosInstance from '../../../shared/api/axiosInstance';

export const CreatePost = async (formData) => {
  const response = await axiosInstance.post('/user/posts/create/', formData, {
    headers: {
      // Content-Type 생략! axios가 자동 설정하게
    },
  });
  return response.data;
};

