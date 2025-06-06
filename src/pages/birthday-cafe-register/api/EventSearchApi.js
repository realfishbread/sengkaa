import axios from 'axios';

export const EventSearchApi = async ({
  keyword,
  startDate,
  endDate,
  genre,
  sort,
}) => {
  const params = new URLSearchParams();

  if (keyword) params.append('keyword', keyword);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (genre) params.append('star_genre', genre);
  if (sort) params.append('sort', sort);

  const token = localStorage.getItem('accessToken');

  const headers = token ? { Authorization: `Bearer ${token}` } : {}; // ✅ 세션 안 쓰니까 withCredentials 필요 없음

  const response = await axios.get(
    `https://eventcafe.site/user/events/birthday-cafes/search/?${params.toString()}`,
    { headers }
  );

  return response.data.results || [];
};

export const fetchPopularCafes = async () => {
  const res = await axios.get(
    'https://eventcafe.site/user/events/birthday-cafes/search/?star_genre=idol',
    {
      params: { sort: 'views' },
    }
  );
  return res.data.results;
};

export const fetchPopularGames = async () => {
  const res = await axios.get(
    'https://eventcafe.site/user/events/birthday-cafes/search/?star_genre=game',
    {
      params: { sort: 'views' },
    }
  );
  return res.data.results;
};

export const fetchPopularWebtoons = async () => {
  const res = await axios.get(
    'https://eventcafe.site/user/events/birthday-cafes/search/?star_genre=webtoon',
    {
      params: { sort: 'views' },
    }
  );
  return res.data.results;
};

export const fetchPopularComics = async () => {
  const res = await axios.get(
    'https://eventcafe.site/user/events/birthday-cafes/search/?star_genre=anime',
    {
      params: { sort: 'views' },
    }
  );
  return res.data.results;
};

export const fetchPopularYoutubers = async () => {
  const res = await axios.get(
    'https://eventcafe.site/user/events/birthday-cafes/search/?star_genre=youtuber',
    {
      params: { sort: 'views' },
    }
  );
  return res.data.results;
};
