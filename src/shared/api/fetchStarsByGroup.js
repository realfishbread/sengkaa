import axiosInstance from './axiosInstance';

export const fetchStarsByGenre = async (genreId) => {
  const response = await axiosInstance.get(`/user/star/by-genre/`, {
    params: { genre_id: genreId }
  });
  return response.data;  // [{ id, name, group }, ...]
};

export const fetchGroupNamesByGenre = async (genreId) => {
  const res = await axiosInstance.get('/user/star/groups/', {
    params: { genre_id: genreId }
  });
  return res.data; // ["에스파", "뉴진스", "르세라핌"]
};
