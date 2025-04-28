// src/components/common/ImageUploader.js
import PropTypes from 'prop-types';
import React from 'react';

const ImageUploader = ({ onUpload }) => {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={onUpload}
      style={{
        margin: '1rem 0',
        display: 'block',
        width: '100%',
        maxWidth: '100%', // ✅ 부모 박스 넘지 않도록
        boxSizing: 'border-box', // ✅ padding 포함 계산
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '6px',
      }}
    />
  );
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImageUploader; // ✅ 반드시 default export 확인!
