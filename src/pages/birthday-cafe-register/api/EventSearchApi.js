import axios from 'axios';

export const EventSearchApi = async ({ keyword, startDate, endDate, genre, sort }) => {
  const params = new URLSearchParams();

  if (keyword) params.append('keyword', keyword);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (genre) params.append('star_genre', genre);  // genre가 스타 장르라면
  if (sort) params.append('sort', sort);

  const response = await axios.get(
    `https://eventcafe.site/user/events/birthday-cafes/?${params.toString()}`,
    { withCredentials: true }  // 쿠키 인증 쓰는 경우만
  );
  return response.data.results || [];
};


export const fetchPopularCafes = async () => {
  const res = await axios.get('https://eventcafe.site/user/events/birthday-cafes/search/', {
    params: { sort: 'views' }
  });
  return res.data.results;
};