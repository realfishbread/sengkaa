import React from 'react';
import { Box, Typography } from '@mui/material';

const WarningBox = () => {
  return (
    <Box
      mt={3}
      p={2}
      sx={{
        backgroundColor: '#fffbea',
        border: '1px solid #ffe58f',
        borderRadius: '8px',
        color: '#ad6800',
        fontSize: '14px',
        lineHeight: 1.5,
      }}
    >
      <Typography fontWeight="bold">⚠️ [주의사항]</Typography>
      <Typography>
        운영비는 장소 대관, 장식, 굿즈 제작 등 실비로만 분담해야 합니다.
        <br />
        모든 활동은 비영리 팬 활동이어야 하며,
        수익 목적이 있을 시 관리자 제재대상이 될 수 있습니다.
      </Typography>
    </Box>
  );
};

export default WarningBox;
