// 📦 NotificationBell.js
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get(
          '/user/notifications/unread-count/'
        );
        setCount(res.data.unread_count);
      } catch (err) {
        console.error('🔕 알림 수 불러오기 실패:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10초마다 polling
    return () => clearInterval(interval);
  }, []);

  return (
    <IconButton color="inherit" onClick={() => navigate('/notifications')}>
      <Badge
        badgeContent={count}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: 'red', // ✅ 배경색
            color: 'white', // ✅ 글씨색
          },
        }}
      >
        <NotificationsIcon style={{ color: 'black' }} />

      </Badge>
    </IconButton>
  );
};

export default NotificationBell;
