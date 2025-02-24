// src/components/common/CustomTextField.js
import React from "react";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { inputFieldStyle } from "./Styles"; // ✅ 기존 스타일 재사용

const CustomTextField = ({ label, value, onChange, multiline = false, rows = 1, required = false }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      margin="dense" //간격 좁히기
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={multiline ? rows : 1} // ✅ multiline이면 rows 적용
      required={required}
      sx={inputFieldStyle} // ✅ 공통 스타일 적용
    />
  );
};

// ✅ props 검증 (예상된 데이터 타입 설정)
CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  required: PropTypes.bool,
};

export default CustomTextField;
