// pages/SignupPage.js
import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
} from "@mui/material";

const SignupPage = () => {
  const handleSignup = () => {
    // 회원가입 처리 로직
    console.log("회원가입 요청");
  };

  return (
    <Container
      maxWidth="xs" // 너비를 좁게 설정
      sx={{
        marginTop: "4rem",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // 부드러운 그림자 효과
      }}
    >
      <Typography
        variant="h5" // 더 작은 제목 크기
        gutterBottom
        textAlign="center"
        sx={{
          marginBottom: "1.5rem",
          color: "#333333",
        }}
      >
        회원가입
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="이름"
          type="text"
          variant="outlined"
          required
          fullWidth
          InputLabelProps={{
            sx: {
              fontSize: "1rem",
            },
          }}
        />
        <TextField
          label="이메일"
          type="email"
          variant="outlined"
          required
          fullWidth
          InputLabelProps={{
            sx: {
              fontSize: "1rem",
            },
          }}
        />
        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          required
          fullWidth
          InputLabelProps={{
            sx: {
              fontSize: "1rem",
            },
          }}
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          variant="outlined"
          required
          fullWidth
          InputLabelProps={{
            sx: {
              fontSize: "1rem",
            },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignup}
          sx={{
            backgroundColor: "#007BFF",
            color: "#ffffff",
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
            transition: "background-color 0.3s ease-in-out",
          }}
        >
          회원가입
        </Button>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "#555555", marginTop: "1rem" }}
        >
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            underline="hover"
            sx={{
              color: "#007BFF",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            로그인
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignupPage;
