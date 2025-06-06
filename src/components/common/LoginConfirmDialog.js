import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

const LoginConfirmDialog = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    aria-labelledby="login-dialog-title"
    aria-describedby="login-dialog-description"
  >
    <DialogTitle id="login-dialog-title">로그인이 필요합니다</DialogTitle>
    <DialogContent dividers>
      <Typography id="login-dialog-description" sx={{ mt: 1 }}>
        이 기능은 <b>로그인 후</b>에 이용하실 수 있어요. 로그인하시겠습니까?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        취소
      </Button>
      <Button variant="contained" onClick={onConfirm} autoFocus>
        로그인
      </Button>
    </DialogActions>
  </Dialog>
);

export default LoginConfirmDialog;
