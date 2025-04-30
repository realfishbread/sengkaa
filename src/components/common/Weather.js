import { useEffect } from 'react';
import axios from 'axios';

const [weather, setWeather] = useState(null);

useEffect(() => {
  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=YOUR_API_KEY&units=metric`
      );
      setWeather(res.data);
    } catch (err) {
      console.error('날씨 불러오기 실패', err);
    }
  };
  fetchWeather();
}, []);