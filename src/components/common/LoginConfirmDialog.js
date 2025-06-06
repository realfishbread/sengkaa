import {
  Box,
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
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        p: 1,
      },
    }}
  >
    <DialogTitle
      id="login-dialog-title"
      sx={{ fontWeight: 700, textAlign: 'center', pb: 0 }}
    >
      로그인 후 이용 가능해요 😊
    </DialogTitle>
    <br />

    <DialogContent dividers sx={{ pt: 2 }}>
      <Typography
        id="login-dialog-description"
        sx={{ textAlign: 'center', lineHeight: 1.6 }}
      >
        이 기능은{' '}
        <Box component="span" fontWeight="bold" color="primary.main">
          로그인
        </Box>
        이 필요해요.
        <br />
        로그인하시겠습니까?
      </Typography>
      <br/>

    </DialogContent>
    <br />
    
    <DialogActions sx={{ justifyContent: 'center', gap: 1.5, pb: 2 }}>
        <br />
      <Button
        onClick={onClose}
        variant="outlined"
        color="inherit"
        sx={{ borderRadius: '999px', px: 3 }}
      >
        아니요
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="primary"
        autoFocus
        sx={{ borderRadius: '999px', px: 3 }}
      >
        로그인하기
      </Button>
    </DialogActions>
  </Dialog>
);

export default LoginConfirmDialog;
