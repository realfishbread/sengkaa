// components/LoginRequiredModal.jsx
import { Dialog, DialogActions, DialogContent, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginRequiredModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    onClose();
    navigate('/login'); // 👉 로그인 페이지로 이동
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
          로그인이 필요해요 😅
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          이 기능은 로그인 후 이용할 수 있어요.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="contained" onClick={handleGoLogin}>
          로그인 하러 가기
        </Button>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginRequiredModal;
