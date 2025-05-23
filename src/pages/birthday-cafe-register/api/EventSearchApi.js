import axios from 'axios';

export const EventSearchApi = async ({ keyword, startDate, endDate, genre }) => {
  const response = await axios.get('https://eventcafe.site/user/events/birthday-cafes/search/', {
    params: {
      keyword,
      start_date: startDate,
      end_date: endDate,
      genre,
    },
  });

  return response.data.results; // ✅ 이렇게 꼭 `.results`만 반환해줘!
};

export const fetchPopularCafes = async () => {
  const res = await axios.get('https://eventcafe.site/user/events/birthday-cafes/search/', {
    params: { sort: 'views' }
  });
  return res.data.results;
};