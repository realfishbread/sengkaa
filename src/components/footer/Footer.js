import React from "react";
import './Footer.css';  // CSS 파일이 있는 경우

const Footer = () => {
  return (
    <footer className="footer" style={{ fontSize: "0.8rem", padding: "0.5rem" }}>
      <p>© EVENTCAFE, Inc | 고객문의 : eventcafe@gmail.com</p>
    </footer>
  );
};

export default Footer;