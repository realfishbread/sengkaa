// src/components/common/CustomTextField.js
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { inputFieldStyle } from './Styles'; // ✅ 기존 스타일 재사용

const CustomTextField = ({
  label,
  value,
  onChange,
  multiline = false,
  rows = 1,
  required = false,
  ...props // ✅ 나머지 props 받기!
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      margin="dense"
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={multiline ? rows : 1}
      required={required}
      sx={inputFieldStyle}
      {...props} // ✅ 여기서 MUI에게 모두 전달!
    />
  );
};

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  required: PropTypes.bool,
};

export default CustomTextField;
