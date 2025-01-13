// pages/LoginPage.js
import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Divider,
} from "@mui/material";
import { SiKakaotalk } from "react-icons/si"; // 카카오톡 아이콘
import { FcGoogle } from "react-icons/fc"; // 구글 아이콘

const LoginPage = () => {
  const handleLogin = () => {
    console.log("로그인 요청");
  };

  const handleKakaoLogin = () => {
    console.log("카카오로 로그인 요청");
  };

  const handleGoogleLogin = () => {
    console.log("구글로 로그인 요청");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#DCF2FF",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "#333333",
            marginBottom: "1.5rem",
          }}
        >
          로그인
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            label="이메일"
            type="email"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            required
            fullWidth
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#007BFF",
              color: "#ffffff",
              padding: "12px",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            로그인
          </Button>
          <Typography variant="body2" textAlign="center" sx={{ color: "#555555" }}>
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              underline="none"
              sx={{
                color: "#007BFF",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              회원가입
            </Link>
          </Typography>
        </Box>
        <Divider
          sx={{
            marginY: 3,
            borderColor: "#E0E0E0",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            SNS로 로그인하기
          </Typography>
        </Divider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            fullWidth
            onClick={handleKakaoLogin}
            sx={{
              backgroundColor: "#FEE500",
              color: "#3C1E1E",
              padding: "12px",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e3d100",
              },
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            <SiKakaotalk size={20} style={{ marginRight: "10px" }} />
            카카오로 로그인
          </Button>
          <Button
            fullWidth
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: "#ffffff",
              color: "#757575",
              padding: "12px",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #E0E0E0",
              "&:hover": {
                backgroundColor: "#f7f7f7",
              },
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            <FcGoogle size={20} style={{ marginRight: "10px" }} />
            구글로 로그인
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
