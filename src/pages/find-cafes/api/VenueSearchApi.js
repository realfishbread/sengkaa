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
  return response.data;
};
