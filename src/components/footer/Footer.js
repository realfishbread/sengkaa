import { Instagram, Twitter } from '@mui/icons-material';
import { Box, Container, IconButton, Link, Typography } from '@mui/material';
import React, { useState } from 'react';
import Logo from '../../components/common/Logo';
import PrivacyPolicyModal from '../../pages/policy/PrivacyPolicyModal';
import TermsModal from '../../pages/policy/TermsModal';
import './Footer.css';

const Footer = () => {
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);

  return (
    <Box component="footer" sx={{ backgroundColor: '#fefffa', padding: '2rem 0', mt: 'auto', borderTop: '1px solid #ddd' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 섹션들 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* About Us */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">About Us</Typography>
            <Typography variant="body2">당신의 덕질 인생, 이벤트카페에서 함께하세요.<br />파티 예약부터 굿즈 관리까지 한 번에!</Typography>
          </Box>

          {/* Follow Us */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">Follow Us</Typography>
            <IconButton href="https://x.com" target="_blank"><Twitter /></IconButton>
            <IconButton href="https://instagram.com" target="_blank"><Instagram /></IconButton>
          </Box>

          {/* Contact Us */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">Contact Us</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>이메일: <Link href="mailto:eventcafe649@gmail.com">eventcafe649@gmail.com</Link></Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}> 운영시간: 평일 오전 9시 ~ 오후 6시 (응답: 24시간 이내)</Typography>
          </Box>

          {/* Service */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">Service</Typography>
            <Link component="button" onClick={() => setOpenTermsModal(true)}>서비스 이용약관</Link>
            <TermsModal open={openTermsModal} onClose={() => setOpenTermsModal(false)} />
            <br />
            <Link component="button" onClick={() => setOpenPrivacyModal(true)}>개인정보 처리방침</Link>
            <PrivacyPolicyModal open={openPrivacyModal} onClose={() => setOpenPrivacyModal(false)} />
            <br />
            <Link href="/faq">자주 묻는 질문</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;