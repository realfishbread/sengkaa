// ✅ 14세 이상 동의 모달 (AgePolicyModal.jsx)
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const AgePolicyModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>14세 이상 이용 동의</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
          {`[만 14세 이상 이용자 확인]

이 서비스는 만 14세 이상 사용자만 가입 및 이용할 수 있습니다.

회원가입 시 다음 사항에 동의하셔야 합니다:
- 본인은 만 14세 이상임을 확인합니다.
- 만 14세 미만의 아동은 법정대리인의 동의가 필요합니다.

거짓된 정보 입력 시 서비스 이용에 제한이 있을 수 있습니다.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgePolicyModal;
