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

  let headers = {};

  try {
    if (token) {
      const [, payload] = token.split('.');
      const parsed = JSON.parse(atob(payload));
      const now = Math.floor(Date.now() / 1000);

      if (parsed.exp > now) {
        headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('⛔️ 토큰 만료됨, 헤더에 포함되지 않음');
      }
    }
  } catch (e) {
    console.warn('⛔️ 토큰 파싱 실패:', e);
  }

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
