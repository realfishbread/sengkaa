import axios from 'axios';
import axiosInstance from './axiosInstance';

export const NavigationBarApi = async ({ keyword, startDate, endDate, genre, venueType }) => {
  const eventPromise = axios.get('https://eventcafe.site/user/events/birthday-cafes/search/', {
    params: { keyword, start_date: startDate, end_date: endDate, genre },
  });

  const venuePromise = axios.get('https://eventcafe.site/user/venues/search/', {
    params: { keyword, type: venueType, start_date: startDate, end_date: endDate },
  });

  const starPromise = axiosInstance.get(`/user/star/stars/?genre=${genre}`); // 내부 도메인 요청이므로 axiosInstance 사용

  const [eventRes, venueRes, starRes] = await Promise.all([eventPromise, venuePromise, starPromise]);

  return {
    events: eventRes.data.results,
    venues: venueRes.data.results,
    stars: starRes.data,
  };
};
