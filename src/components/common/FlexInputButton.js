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
      />
      <Button
        variant="outlined"
        onClick={onButtonClick}
        sx={{
          whiteSpace: 'nowrap',
          height: '56px',
          minWidth: '80px',
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
