// api/VenueSearchApi.js
import axios from 'axios';

export const VenueSearchApi = async ({
  keyword,
  venueType,
  startDate,
  endDate,
}) => {
  const response = await axios.get('https://eventcafe.site/user/venues/search/', {
    params: {
      keyword,
      type: venueType,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return response.data.results;
};

export const fetchPopularVenues = async () => {
  const res = await axios.get('https://eventcafe.site/user/venues/search/', {
    params: { sort: 'view_desc' } // ✅ 여긴 view_desc임
  });
  return res.data.results;
};