import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
} from "@mui/material";
import { buttonStyle } from "../../../components/common/Styles";
import CustomTextField from "../../../components/common/CustomTextField";
import axios from "axios";


const SignupPage = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [error, setError] = useState(false); // 비밀번호 불일치 에러 상태
  const [showEmailVerification, setShowEmailVerification] = useState(false); // 이메일 인증 필드 표시 여부
  const [timer, setTimer] = useState(180); // 타이머 초기값(3분)
  const [code, setCode] = useState(""); // 입력된 인증 코드 상태

  useEffect(() => {
    let timerInterval;
    if (showEmailVerification && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [showEmailVerification, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!code) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    //회원가입 요청청
    try {
      const response = await axios.post("http://127.0.0.1:8000/user/register/", {
        username: email.split("@")[0],
        email,
        password,
      });

      console.log("회원가입 성공:", response.data);
      alert("회원가입 성공! 로그인하세요.");
      window.location.href = "/login";
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data);
      alert("회원가입 실패. 다시 시도해주세요.");
    }
  };

 // ✅ 이메일 인증 코드 전송 API 요청
 const handleSendVerification = async () => {
  setShowEmailVerification(true);
  setTimer(180); // 3분 타이머 초기화

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/send-email-verification/", {
      email,
    });
    console.log("인증 코드 전송 성공:", response.data);
    alert("인증 코드가 이메일로 전송되었습니다.");
  } catch (error) {
    console.error("인증 코드 전송 실패:", error.response?.data);
    alert("인증 코드 전송에 실패했습니다.");
  }
};

  const handleCodeVerification = () => {
    // 인증 코드 확인 로직 추가 가능
    console.log("입력된 코드:", code);
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
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "#333333",
            marginBottom: "1.5rem",
            
          }}
        >
          회원가입
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <CustomTextField label="이름" type="text"/>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row", // 가로로 배치
              alignItems: "center",
              gap: 1,
            }}
          >
            <CustomTextField label="이메일" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            <Button
              variant="outlined"
              onClick={handleSendVerification}
              sx={{
                padding: "10px 16px", // 버튼의 크기 조정
                fontWeight: "bold",
                fontSize: "0.9rem",
                borderRadius: "6px",
                color: "#007BFF",
                borderColor: "#007BFF",
                "&:hover": {
                  backgroundColor: "#e6f4ff",
                },
              }}
            >
              인증
            </Button>
          </Box>

          {/* 이메일 인증 코드 입력 필드 */}
          {showEmailVerification && (
            <Box>
              <TextField
                label="인증 코드"
                type="text"
                variant="outlined"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ marginBottom: "0.5rem" }}
              />
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: timer > 0 ? "#555555" : "#FF0000",
                }}
              >
                {timer > 0
                  ? `남은 시간: ${formatTime(timer)}`
                  : "인증 시간이 만료되었습니다."}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCodeVerification}
                disabled={timer <= 0}
                sx={{
                  marginTop: "0.5rem",
                  backgroundColor: timer > 0 ? "#007BFF" : "#d3d3d3",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: timer > 0 ? "#0056b3" : "#d3d3d3",
                  },
                }}
              >
                인증 확인
              </Button>
            </Box>
          )}
          <CustomTextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomTextField
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error}
            helperText={error ? "비밀번호가 일치하지 않습니다." : ""}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleSignup}
            sx={buttonStyle}
          >
            회원가입
          </Button>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              color: "#555555",
              marginTop: "1rem",
            }}
          >
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{
                color: "#007BFF",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#0056b3",
                },
              }}
            >
              로그인
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
