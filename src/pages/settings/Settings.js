import {
  CalendarMonth,
  Delete,
  Lock,
  Notifications,
  Settings,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';

const SettingsPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/user/auth/delete-user/`);
      alert('회원 탈퇴가 완료되었습니다. 안녕히 가세요 😢');
      setOpenDialog(false);
      navigate('/'); // 홈이나 로그인 페이지로 이동
      // localStorage.clear(); // 토큰 정리 필요 시
    } catch (err) {
      alert('탈퇴 실패... 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: 'auto', my: 6, px: 2 }}>
        {/* 상단 프로필 카드 */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            backgroundColor: '#f9f9f9',
            borderRadius: 3,
            mb: 5,
          }}
        >
          <Avatar
            src={user?.profile_image || ''}
            alt={user?.nickname}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {user?.nickname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Paper>

        {/* 설정 항목 리스트 */}
        <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
          <List>
            <ListItem
              button
              onClick={() => navigate(`/profile/${user.nickname}`)}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="계정 설정" />
            </ListItem>

            <Divider />

            <ListItem button onClick={() => navigate('/forgot-password/')}>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary="비밀번호 변경" />
            </ListItem>

            <Divider />

            <ListItem button onClick={() => navigate('/my-bookings')}>
              <ListItemIcon>
                <CalendarMonth />
              </ListItemIcon>
              <ListItemText primary="내 예약 목록" />
            </ListItem>
            <Divider />

            <ListItem button>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText primary="알림 설정" />
            </ListItem>

            <Divider />

            <ListItem
              button
              sx={{ color: 'red' }}
              onClick={() => setOpenDialog(true)}
            >
              <ListItemIcon>
                <Delete color="error" />
              </ListItemIcon>
              <ListItemText primary="회원 탈퇴" />
            </ListItem>
          </List>
        </Paper>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>정말 탈퇴하시겠어요? 😥</DialogTitle>
        <DialogContent>
          <Typography>
            탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            탈퇴하기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsPage;
