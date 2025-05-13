import { Backdrop, Box, Modal } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './Login';

const LoginModalWrapper = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ 딤 배경 진하게
        },
      }}
      sx={{
        zIndex: 1300, // ✅ z-index 높여서 항상 맨 위로
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          px: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'relative',
            zIndex: 1400,
            width: '100%',
            maxWidth: '430px',
            margin: '0 auto',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 520, // ✅ 여기서 더 넓게 설정
              bgcolor: '#fff',
              color: '#000 !important',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2) !important',
              opacity: '1 !important',
              filter: 'none !important',
              backdropFilter: 'none !important',
              transform: 'none !important',
              transition: 'none !important',
              borderRadius: 3,
              zIndex: 9999,
            }}
          >
            <LoginPage isModal={true} />
          </Box>
        </motion.div>
      </Box>
    </Modal>
  );
};

export default LoginModalWrapper;
