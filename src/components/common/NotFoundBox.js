// components/common/NotFoundBox.jsx
import { Box, Typography } from '@mui/material';
import React from 'react';

const NotFoundBox = ({ 
  image = '/images/error-cat.png', 
  title = '정보를 찾을 수 없어요!', 
  message = '입력한 닉네임이 잘못되었거나, 서버에서 정보를 불러오지 못했어요.' 
}) => {
  return (
    <Box textAlign="center" py={5}>
      <Box
        component="img"
        src={image}
        alt="에러 이미지"
        sx={{ maxWidth: 300, mb: 4 }}
      />
      <Typography variant="h6" fontWeight="bold" color="error" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {message}
      </Typography>
    </Box>
  );
};

export default NotFoundBox;
