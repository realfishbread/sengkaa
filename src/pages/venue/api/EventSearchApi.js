// ✅ EventSearchApi.js
import axios from 'axios';

export const EventSearchApi = async ({ keyword, startDate, endDate, genre }) => {
  const res = await axios.get('https://eventcafe.site/user/events/birthday-cafes/search/', {
    params: {
      keyword,
      startDate,
      endDate,
      genre,
    },
  });
  return res.data;
};
