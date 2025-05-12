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
        backgroundColor: '#f8f9fa',
        padding: '2rem 0',
        mt: 'auto',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Box display="flex" justifyContent="flex-end" width="55%"> {/* flex-end 고정, width 크기 줄여야 로고가 움직임 */}
                <Logo 
                  width="150px" 
                  height="auto" 
                  sx={{ mb: 2, maxWidth: '150px', textAlign: 'left' }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                당신의 덕질 인생, 이벤트카페에서 함께하세요.
                <br />
                파티 예약부터 굿즈 관리까지 한 번에!
              </Typography>
              <Box mt={2} display="flex" gap={1}>
                <IconButton
                  component="a"
                  href="https://instagram.com/yunissi_o.o"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://twitter.com/yourbrand"
                  target="_blank"
                  rel="noopener"
                  aria-label="Twitter"
                >
                  <Twitter />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              고객지원
            </Typography>
            <Typography variant="body2">
              이메일:{' '}
              <Link href="mailto:eventcafe649@gmail.com">
                eventcafe649@gmail.com
              </Link>
              <br />
              운영시간: 평일 오전 9시 ~ 오후 6시
              <br />
              문의 응답은 영업일 기준 24시간 이내
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              서비스
            </Typography>
            <Typography variant="body2">
              <Link
                component="button"
                onClick={() => setOpenTermsModal(true)}
                underline="hover"
              >
                이용약관
              </Link>
              <TermsModal
                open={openTermsModal}
                onClose={() => setOpenTermsModal(false)}
              />
              <br />
              <Link
                component="button"
                onClick={() => setOpenPrivacyModal(true)}
                underline="hover"
              >
                개인정보 처리방침
              </Link>
              <PrivacyPolicyModal
                open={openPrivacyModal}
                onClose={() => setOpenPrivacyModal(false)}
              />
              <br />
              <Link href="/faq" underline="hover">
                자주 묻는 질문
              </Link>
            </Typography>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} EVENTCAFE, Inc. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
