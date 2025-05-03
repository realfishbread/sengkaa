// src/components/common/FlexInputButton.js

import { Box, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const FlexInputButton = ({
  label,
  value,
  buttonText,
  onButtonClick,
  readOnly = false,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
      <TextField
        label={label}
        value={value}
        fullWidth
        InputProps={{ readOnly }}
        sx={{
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
          },
        }}
      />
      <Button
        variant="outlined"
        onClick={onButtonClick}
        sx={{
          whiteSpace: 'nowrap',
          height: '56px',
          minWidth: '80px',
          backgroundColor: '#007aff',
          color: '#fff', // ✅ 텍스트 색상 확실하게
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)', // ✅ 그림자 추가!
          '&:hover': {
            backgroundColor: '#005fcc', // ✅ hover 시 색상
            color: '#fff', // ✅ 글자색 유지
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', // ✅ hover 시 더 강한 그림자
          },
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

FlexInputButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

export default FlexInputButton;
