// EventCalendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventCalendar.css'; // 👈 스타일 따로 관리 추천
import { useEffect } from 'react';
import axios from 'axios';

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weather, setWeather] = useState(null);

  const events = {
    '2025-04-20': ['뷔 생일카페 🎂', '이태원 콜라보카페 🎉'],
    '2025-04-22': ['세븐틴 팬 이벤트 🧡'],
  };

  const formatDate = (date) => date.toISOString().split('T')[0];



  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=9c026a429e95428e9a473521253004&q=${lat},${lon}`
        );
        console.log('✅ 날씨 데이터:', res.data);
        setWeather({
          ...res.data.current,
          location: res.data.location.name,
        });
      } catch (err) {
        console.error('❌ 날씨 불러오기 실패:', err);
      }
    };
  
    // 위치 요청
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('❌ 위치 권한 거부 또는 실패:', error);
          // fallback: 서울 날씨
          fetchWeather(37.5665, 126.9780);
        }
      );
    } else {
      console.warn('⚠️ 위치 기능을 사용할 수 없습니다.');
      // fallback: 서울 날씨
      fetchWeather(37.5665, 126.9780);
    }
  }, []);

  return (
    

<div className="calendar-layout">
  <div className="left-panel">
    <div>
    <div className="weather">
    {weather ? (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img
      src={`https:${weather.condition.icon}`}
      alt="weather icon"
      style={{ width: 60, height: 60 }}
    />
    <h2>{weather.temp_c}°C </h2>
    <h2> {weather.location}</h2>
    <p>{weather.condition.text}</p>
  </div>
) : (
  <p style={{ color: '#fff' }}>⏳ 날씨 정보를 불러오는 중입니다...</p>
)}
</div>
      <div className="task-list">
        <div className="task">
          <span className="task-time">09:00</span>Send a message to James
        </div>
        <div className="task">
          <span className="task-time">11:00</span>Reading a new book
        </div>
      </div>
    </div>
    <div style={{ fontSize: 13, opacity: 0.7 }}>Have a nice day ☀️</div>
  </div>

  <div className="right-panel">
    <h2 style={{ marginBottom: 20 }}>📍 생일카페 일정</h2>
    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      className="custom-calendar"
    />
    <div className="schedule-box">
      <h3>{formatDate(selectedDate)} 일정</h3>
      <ul>
        {events[formatDate(selectedDate)] ? (
          events[formatDate(selectedDate)].map((event, idx) => (
            <li key={idx}>{event}</li>
          ))
        ) : (
          <li>일정이 없습니다.</li>
        )}
      </ul>
    </div>
  </div>
</div>


    
  );
};

export default EventCalendar;
