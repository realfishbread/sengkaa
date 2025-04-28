import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyResetCode } from '../api/passwordApi';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const email = useLocation().state?.email || '';

  const handleVerify = async () => {
    try {
      await verifyResetCode(email, code);
      alert('인증 성공!');
      navigate('/reset-password/', { state: { email } });
    } catch (e) {
      alert('인증 실패: ' + (e.response?.data?.error || '알 수 없는 에러'));
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(to bottom, #cfeffd, #a3d9ff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          인증 코드 확인
        </Typography>

        <Typography variant="body2" mb={1}>
          이메일: {email}
        </Typography>

        <TextField
          fullWidth
          label="인증 코드"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleVerify}>
          확인
        </Button>
      </Container>
    </Box>
  );
}
