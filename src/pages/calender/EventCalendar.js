import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventCalendar.css';

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  const events = {
    '2025-04-19': ['뛰기', '테스트', '미팅', '저녁 식사'],
    '2025-04-20': ['뷔 생일카페 🎂', '이태원 콜라보카페 🎉'],
    '2025-04-22': ['세븐틴 팬 이벤트 🧡'],
  };

  const formatDate = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    setSelectedDate(date);
    setSelectedEvents(events[dateStr] || []);
  };

  return (
    <div className="calendar-layout">
      <div className="right-panel">
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
                  <div key={idx} className="event-item">{event}</div>
                ))}
                {eventList.length > 2 && (
                  <div className="event-item more">
                    + 더 보기
                  </div>
                )}~
              </div>
            );
          }}
        />
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
  );
};

export default EventCalendar;
