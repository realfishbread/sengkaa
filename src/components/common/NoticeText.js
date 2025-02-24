// src/components/common/NoticeText.js
import React from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const NoticeText = ({ text }) => {
  return (
    <Typography
      variant="caption"
      display="block"
      color="gray"
      textAlign="left"
      marginTop={0.5}
      marginBottom={2}
    >
      {text}
    </Typography>
  );
};

NoticeText.propTypes = {
  text: PropTypes.string.isRequired, // ✅ 반드시 text 값을 받도록 설정
};

export default NoticeText;
