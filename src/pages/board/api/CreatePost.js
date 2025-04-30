// src/api/postApi.js
import axios from 'axios';

export const CreatePost = async (formData) => {
  const token = localStorage.getItem('accessToken'); // ✅ 여기 추가 필요!

  const response = await axios.post(
    'https://eventcafe.site/user/posts/create/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // ✅ 여기서 token 제대로 쓰기
      },
    }
  );
  return response.data;
};
