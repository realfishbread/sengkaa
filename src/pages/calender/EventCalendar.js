import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import LoginConfirmDialog from '../../components/common/LoginConfirmDialog';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance'; // axios 인스턴스
import './EventCalendar.css';

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [weather, setWeather] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [askLogin, setAskLogin] = useState(false);
  const [events, setEvents] = useState({});

  useEffect(() => {
    // ⬅️ ③ 추가
    if (!user) {
      // loading 끝난 뒤에만 질문
      setAskLogin(true); // 모달 오픈
    }
  }, [user, navigate]);

  const formatDate = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    setSelectedDate(date);
    setSelectedEvents(events[dateStr] || []);
  };

  const groupEventsByTitle = (eventsData) => {
    const grouped = {};

    eventsData.forEach((event) => {
      const { title, start, end } = event;
      const key = title;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push({ start: new Date(start), end: new Date(end) });
    });

    return grouped;
  };

  const formatGroupedEvents = (grouped) => {
    const result = {};

    Object.entries(grouped).forEach(([title, ranges]) => {
      const formattedRanges = new Set();

      ranges.forEach(({ start, end }) => {
        const rangeText = `📍 ${title}`;

        const current = new Date(start);
        while (current <= end) {
          const dateStr = current.toISOString().split('T')[0];

          if (!result[dateStr]) result[dateStr] = [];

          if (!result[dateStr].includes(rangeText)) {
            result[dateStr].push(rangeText);
          }

          current.setDate(current.getDate() + 1);
        }
      });
    });

    return result;
  };

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=9c026a429e95428e9a473521253004&q=${lat},${lon}&lang=ko`
        );
        console.log('✅ 날씨 데이터:', res.data);
        setWeather({
          ...res.data.current,
          location: res.data.location.name,
        });
      } catch (err) {
        console.error('❌ 날씨 불러오기 실패:', err);
        setWeather({ error: '날씨 정보를 불러올 수 없습니다.' });
      }
    };

    // 현재 위치(양주시)의 위도와 경도
    const latitude = 37.8348;
    const longitude = 127.0569;

    fetchWeather(latitude, longitude);
  }, []);

  useEffect(() => {
    const loadLikedEvents = async () => {
      try {
        const res = await axiosInstance.get('/user/events/liked/calendar/');
        const grouped = groupEventsByTitle(res.data);
        const finalEvents = formatGroupedEvents(grouped);

        setEvents(finalEvents);
      } catch (err) {
        console.error('찜한 생일카페 일정 불러오기 실패 ❌', err);
      }
    };

    loadLikedEvents();
  }, []);

  useEffect(() => {
    if (!user?.star) return;

    const birthday = user.star.birthday;
    const name = user.star.name;

    if (birthday && name) {
      const [, month, day] = birthday.split('-');
      const birthdayKey = `${new Date().getFullYear()}-${month.padStart(
        2,
        '0'
      )}-${day.padStart(2, '0')}`;

      setEvents((prev) => ({
        ...prev,
        [birthdayKey]: [`${name} 생일 🎉`, ...(prev[birthdayKey] || [])],
      }));
      console.log('✅ 생일 이벤트 추가됨:', birthdayKey);
    }
  }, [user]);

  return (
    <>
      <div className="calendar-layout">
        <div className="calendar-panel">
          <h2>나의 덕질 일정</h2>
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            className="custom-calendar"
            tileContent={({ date }) => {
              const dateStr = formatDate(date);
              const eventList = events[dateStr] || [];

              return (
                <div className="event-list">
                  {eventList.slice(0, 2).map((event, idx) => (
                    <div key={idx} className="event-item">
                      {event}
                    </div>
                  ))}
                  {eventList.length > 2 && (
                    <div className="event-item more">+ 더 보기</div>
                  )}
                </div>
              );
            }}
          />
        </div>

        <div className="right-section">
          <div className="weather-box">
            <h3>{weather?.location || '날씨 정보'}</h3>
            {weather ? (
              weather.error ? (
                <p>{weather.error}</p>
              ) : (
                <div>
                  <img src={weather.condition.icon} alt="날씨 아이콘" />
                  <p>{weather.condition.text}</p>
                  <p>{weather.temp_c}°C</p>
                </div>
              )
            ) : (
              <p>날씨 정보를 불러오는 중...</p>
            )}
          </div>

          <div className="schedule-box">
            <h3>{formatDate(selectedDate)} 일정</h3>
            <ul>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, idx) => <li key={idx}>{event}</li>)
              ) : (
                <li>일정이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ↓ 로그인 확인 모달 */}
      <LoginConfirmDialog
        open={askLogin}
        onClose={() => setAskLogin(false)} // 취소
        onConfirm={
          () => navigate('/login', { state: { from: '/calendar' } }) // 로그인
        }
      />
    </>
  );
};

export default EventCalendar;
