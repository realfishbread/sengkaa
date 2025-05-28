// 📦 NotificationBell.js
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';
import NotificationModal from './NotificationModal';

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "회원님이 참여 신청한 '방탄소년단 RM 생일카페' 이벤트가 승인되었습니다.",
      time: "4일",
      isRead: false
    },
    {
      id: 2,
      message: "회원님이 등록한 '카페 마루' 장소가 승인되었습니다.",
      time: "5일",
      isRead: false
    },
    {
      id: 3,
      message: "새로운 이벤트가 등록되었습니다: '뉴진스 해린 생일카페'",
      time: "1일",
      isRead: false
    }
  ]);

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
    // try {
    //   await axiosInstance.patch('/user/notifications/mark-all-read/');
    // } catch (err) {
    //   console.error('알림 읽음 처리 실패:', err);
    // }
  };

  const handleDeleteNotification = (notificationId) => {
    // 알림 삭제 처리
    setNotifications(notifications.filter(n => n.id !== notificationId));
    setCount(prevCount => Math.max(0, prevCount - 1));

    // API 연동 시 아래 코드 활성화
    // try {
    //   await axiosInstance.delete(`/user/notifications/${notificationId}/`);
    // } catch (err) {
    //   console.error('알림 삭제 실패:', err);
    // }
  };

  const fetchNotifications = async () => {
    try {
      const [countRes, notificationsRes] = await Promise.all([
        axiosInstance.get('/user/notifications/unread-count/'),
        axiosInstance.get('/user/notifications/')
      ]);
      
      // API 연동 시 아래 코드 활성화
      // setCount(countRes.data.unread_count);
      // setNotifications(notificationsRes.data.map(notification => ({
      //   message: notification.message,
      //   time: new Date(notification.created_at).toLocaleDateString(),
      //   isRead: notification.is_read
      // })));

      // 임시로 읽지 않은 알림 수 설정
      setCount(notifications.filter(n => !n.isRead).length);
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
      />
    </>
  );
};

export default NotificationBell;
