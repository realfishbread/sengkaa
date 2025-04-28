// components/Logo.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = ({
  src = '/images/logo.png',
  alt = 'Event Cafe Logo',
  onClickPath = '/',
}) => {
  const navigate = useNavigate();

  return (
    <img
      src={src}
      alt={alt}
      className="logo"
      onClick={() => navigate(onClickPath)}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default Logo;
