// 📦 NotificationBell.js
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';
import NotificationModal from './NotificationModal';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleInviteResponse = async (roomId, action) => {
  try {
    const res = await axiosInstance.post(`/user/chat/respond/${roomId}/`, {
      action: action
    });
    alert(res.data.detail); // 성공 메시지

    // 수락했다면 채팅방으로 이동
    if (action === 'accept') {
      navigate(`/chat/${roomId}`);
    }

    // 수락/거절 후 알림 목록 갱신
    fetchNotifications();
  } catch (err) {
    console.error('초대 응답 실패:', err);
    alert('초대 처리 중 오류가 발생했어요.');
  }
};

  const handleCloseModal = () => {
    // 모달이 닫힐 때 모든 알림을 읽음 처리
    markAllAsRead();
    setNotificationOpen(false);
  };

  const markAllAsRead = async () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    setCount(0);

    // API 연동 시 아래 코드 활성화
    try {
     await axiosInstance.patch('/user/notifications/mark-all-read/');
     } catch (err) {
       console.error('알림 읽음 처리 실패:', err);
     }
  };

  const handleDeleteNotification = async (notificationId) => {
  setNotifications(notifications.filter(n => n.id !== notificationId));
  setCount(prevCount => Math.max(0, prevCount - 1));

  try {
    await axiosInstance.delete(`/user/notifications/${notificationId}/`);
  } catch (err) {
    console.error('알림 삭제 실패:', err);
  }
};

  const fetchNotifications = async () => {
  try {
    const [countRes, notificationsRes] = await Promise.all([
      axiosInstance.get('/user/notifications/unread-count/'),
      axiosInstance.get('/user/notifications/')
    ]);

    setCount(countRes.data.unread_count);
    setNotifications(notificationsRes.data.map(notification => ({
      id: notification.id,
      message: notification.message,
      time: new Date(notification.created_at).toLocaleDateString(),
      isRead: notification.is_read
    })));
    
  } catch (err) {
    console.error('🔕 알림 데이터 불러오기 실패:', err);
  }
};

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10초마다 polling
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <IconButton onClick={() => setNotificationOpen(true)}>
        <Badge
          variant="dot"
          invisible={count === 0}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'red',
              color: 'white',
              right: 3,
              top: 3
            },
          }}
        >
          <NotificationsIcon style={{ color: 'black' }} />
        </Badge>
      </IconButton>

      <NotificationModal
        open={notificationOpen}
        onClose={handleCloseModal}
        notifications={notifications}
        onDeleteNotification={handleDeleteNotification}
        onMarkAllAsRead={markAllAsRead}
        onRespondToInvite={handleInviteResponse} // ✅ 추가
      />
    </>
  );
};

export default NotificationBell;
