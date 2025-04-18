import React, { useState } from "react"; // ✅ 이렇게 해야 함
import {
  Box,
  Button,
  Typography,
  Link,
  Container,
  Divider,
} from "@mui/material";
import { SiKakaotalk } from "react-icons/si"; // 카카오톡 아이콘
import { FcGoogle } from "react-icons/fc"; // 구글 아이콘
import {buttonStyle}from "../../../components/common/Styles";
import CustomTextField from "../../../components/common/CustomTextField";

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("https://eventcafe.site/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("로그인 성공:", data);

        // 예: 토큰 저장 후 페이지 이동 등
        localStorage.setItem("token", data.token);
        window.location.href = "/profile"; // 혹은 navigate("/profile") 사용
      } else {
        const errorData = await response.json();
        alert("로그인 실패: " + errorData.message);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
    }
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
        backgroundImage: "linear-gradient(to bottom, #cfeffd, #a3d9ff)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          padding: "1.5rem",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 로고 섹션 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem", // 제목과의 간격
          }}
        >
          <img
            src="/images/logo.png" // 로고 이미지 경로
            alt="App Logo"
            style={{
              height: "60px", // 로고 크기
              width: "auto", // 비율 유지
            }}
          />
        </Box>

        {/* 제목 */}
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "#333333",
            marginBottom: "1.5rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          로그인
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
                  <CustomTextField
          label="이메일"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#007BFF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0056b3",
              },
            },
          }}
        />

        <CustomTextField
          label="비밀번호"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#007BFF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0056b3",
              },
            },
          }}
        />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx= {buttonStyle}
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
                  color: "#0056b3",
                },
              }}
            >
              회원가입
            </Link>
          </Typography>
        </Box>

        <Divider
          sx={{
            marginY: 2,
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
            gap: 1.5,
          }}
        >
          <Button
            fullWidth
            onClick={handleKakaoLogin}
            sx={{
              backgroundColor: "#FEE500",
              color: "#3C1E1E",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              borderRadius: "6px",
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#e3d100",
                transform: "scale(1.02)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            <SiKakaotalk size={18} style={{ marginRight: "8px" }} />
            카카오로 로그인
          </Button>
          <Button
            fullWidth
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: "#ffffff",
              color: "#757575",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              borderRadius: "6px",
              border: "1px solid #E0E0E0",
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#f7f7f7",
                transform: "scale(1.02)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            <FcGoogle size={18} style={{ marginRight: "8px" }} />
            구글로 로그인
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
