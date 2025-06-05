// ✅ 개인정보처리방침 모달 (PrivacyPolicyModal.jsx)
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const PrivacyPolicyModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>개인정보 처리방침</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
          {`[수집하는 개인정보 항목]
- 이름, 이메일, 닉네임, 비밀번호

[개인정보의 수집 및 이용 목적]
- 회원 식별 및 본인 확인
- 서비스 제공 및 운영, 문의사항 대응

[보유 및 이용기간]
- 회원 탈퇴 시 즉시 파기하며, 관계법령에 따라 보관이 필요한 경우 일정 기간 보유

[개인정보 제공 및 위탁]
- 원칙적으로 제3자에게 제공하지 않으며, 외부 위탁 시 별도 동의를 받습니다.

[이용자의 권리]
- 이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.

본 방침은 2025년 4월 29일부터 시행됩니다.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
