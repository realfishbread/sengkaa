// src/api/postApi.js
import axios from 'axios';

export const CreatePost = async (formData) => {
  const response = await axios.post(
    'https://eventcafe.site/user/posts/create/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
