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
  if (genre) params.append('star_genre', genre); // genre가 스타 장르라면
  if (sort) params.append('sort', sort);

  const response = await axios.get(
    `https://eventcafe.site/user/events/birthday-cafes/?${params.toString()}`
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
