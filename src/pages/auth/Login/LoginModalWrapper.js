import React from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginPage from "./Login";

const LoginModalWrapper = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
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
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 회색 반투명 배경
        },
      }}
    >
      <Fade in={true}>
      
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            p: 2,
          }}
        >
            
          <Box
            sx={{
              width: "100%",
              maxWidth: 420,
              bgcolor: "background.paper",
              borderRadius: "16px",
              boxShadow: 24,
              overflow: "hidden",
            }}
          >
            <LoginPage isModal={true} />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default LoginModalWrapper;
