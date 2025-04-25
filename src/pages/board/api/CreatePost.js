// src/api/postApi.js
import axiosInstance from "../shared/api/axiosInstance";

export const createPost = async (formData) => {
  const response = await axiosInstance.post("/user/posts/create/", formData);
  return response.data;
};
