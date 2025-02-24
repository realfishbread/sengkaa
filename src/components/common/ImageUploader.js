// src/components/common/ImageUploader.js
import React from "react";
import PropTypes from "prop-types";

const ImageUploader = ({ onUpload }) => {

    return(
  <input 
    type="file" 
    accept="image/*" 
    onChange={onUpload} 
    style={{
      margin: "1rem 0",
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "6px",
    }} 
  />
)
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImageUploader; // ✅ 반드시 default export 확인!
