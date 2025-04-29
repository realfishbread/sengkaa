import React from "react";
import { Modal, Box, Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginPage from "./Login";

const LoginModalWrapper = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // 뒤로 가기
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ 딤 배경 진하게
        },
      }}
      sx={{
        zIndex: 1300, // ✅ z-index 높여서 항상 맨 위로
      }}
    >
      
      <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      px: 2,
    }}
  >
    <Box
  sx={{
    width: "100%",
    maxWidth: 420,
    bgcolor: "#ffffff !important",
    color: "#000 !important",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2) !important",
    opacity: "1 !important",
    filter: "none !important",
    backdropFilter: "none !important",
    transform: "none !important",
    transition: "none !important",
    borderRadius: 3,
    zIndex: 9999,
  }}
>
      <LoginPage isModal={true} />
    </Box>
  </Box>
</Modal>
  );
};

export default LoginModalWrapper;
