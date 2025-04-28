// src/components/common/NoticeText.js
import React from "react";
import PropTypes from "prop-types";

const NoticeText = ({ text }) => {
  return (
    <p className="text-sm text-gray-500 text-left mt-1 mb-4 leading-relaxed tracking-wide">
      {text}
    </p>
  );
};

NoticeText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default NoticeText;
