// src/components/common/LoginConfirmDialog.js
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography
} from '@mui/material';

const LoginConfirmDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>로그인이 필요합니다</DialogTitle>
    <DialogContent>
      <Typography>
        달력 기능은 <b>로그인 후</b>에 이용하실 수 있어요. 로그인하시겠습니까?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>취소</Button>
      <Button variant="contained" onClick={onConfirm}>로그인</Button>
    </DialogActions>
  </Dialog>
);

export default LoginConfirmDialog;
