// src/components/TermsModal.jsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const TermsModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>이용약관</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
          {`[제1조 목적]
본 약관은 이벤트카페(이하 "서비스")가 제공하는 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.

[제2조 용어의 정의]
1. "회원"이라 함은 본 약관에 동의하고 회사와 이용계약을 체결한 자를 말합니다.
2. "서비스"란 회사가 제공하는 이벤트 등록, 장소 예약, 커뮤니티 기능 등 일체의 온라인 서비스를 말합니다.

[제3조 이용계약의 성립]
1. 서비스 이용계약은 회원이 본 약관의 내용에 동의하고, 회원가입을 신청한 후 회사가 이를 승낙함으로써 체결됩니다.
2. 회사는 회원의 정보가 허위이거나 타인의 정보를 도용한 경우, 서비스 제공을 거부할 수 있습니다.

[제4조 회원의 의무]
1. 회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
2. 회원은 본인의 계정을 타인에게 대여하거나 양도할 수 없습니다.

[제5조 개인정보보호]
1. 회사는 관련 법령에 따라 회원의 개인정보를 보호하며, 회원의 동의 없이 제3자에게 제공하지 않습니다.
2. 단, 법령에 의해 요구되는 경우에는 예외로 할 수 있습니다.

[제6조 서비스의 변경 및 종료]
1. 회사는 서비스 운영상, 기술상 필요한 경우 사전 공지 후 서비스를 변경하거나 일시 중지할 수 있습니다.
2. 회사는 불가항력적인 사유로 서비스 제공이 불가능할 경우, 회원에게 별도의 보상을 하지 않습니다.

[제7조 약관의 효력 및 변경]
1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 공지와 동시에 효력이 발생합니다.

[제8조 분쟁의 해결]
1. 본 약관은 대한민국 법령에 따라 해석되며, 서비스와 관련하여 분쟁이 발생한 경우 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.

부칙. 본 약관은 2025년 4월 29일부터 시행합니다.

`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsModal;
