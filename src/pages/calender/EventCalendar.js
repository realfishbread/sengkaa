// EventCalendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventCalendar.css'; // 👈 스타일 따로 관리 추천

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = {
    '2025-04-20': ['뷔 생일카페 🎂', '이태원 콜라보카페 🎉'],
    '2025-04-22': ['세븐틴 팬 이벤트 🧡'],
  };

  const formatDate = date => date.toISOString().split('T')[0];

  return (
    <div className="calendar-wrapper">
      <h2>📍 생일카페/이벤트 캘린더</h2>
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
  );
};

export default EventCalendar;
