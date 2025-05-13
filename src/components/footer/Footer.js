import { Instagram, Twitter } from '@mui/icons-material';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Logo from '../../components/common/Logo';
import PrivacyPolicyModal from '../../pages/auth/SignUp/policy/PrivacyPolicyModal';
import TermsModal from '../../pages/auth/SignUp/policy/TermsModal';

const Footer = () => {
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fefffa',
        padding: '1rem 0',
        mt: 'auto',
        borderTop: '1px solid #ddd',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 왼쪽: 로고 */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Logo width="100px" height="auto" sx={{ maxWidth: '150px' }} />
        </Box>

        {/* 가운데: 서비스 링크 */}
        <Box
          sx={{
            flex: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            whiteSpace: 'nowrap',  // 텍스트 줄바꿈 방지
          }}
        >
          <Link
            component="button"
            onClick={() => setOpenTermsModal(true)}
            underline="hover"
            color="text.primary"
          >
            서비스 이용약관
          </Link>
          <TermsModal
            open={openTermsModal}
            onClose={() => setOpenTermsModal(false)}
          />
          <Link
            component="button"
            onClick={() => setOpenPrivacyModal(true)}
            underline="hover"
            color="text.primary"
          >
            개인정보 처리방침
          </Link>
          <PrivacyPolicyModal
            open={openPrivacyModal}
            onClose={() => setOpenPrivacyModal(false)}
          />
          <Link href="/faq" underline="hover" color="text.primary">
            자주 묻는 질문
          </Link>
        </Box>

        {/* 오른쪽: 회사 정보 */}
        <Box
          sx={{
            flex: 3,
            textAlign: { xs: 'center', md: 'right' },
            lineHeight: '1.5',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            당신의 덕질 인생, 이벤트카페에서 함께하세요.
            <br />
            파티 예약부터 굿즈 관리까지 한 번에!
            <br />
            이메일: <Link href="mailto:eventcafe649@gmail.com">eventcafe649@gmail.com</Link>
            <br />
            운영시간: 평일 오전 9시 ~ 오후 6시 (응답: 24시간 이내)
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
