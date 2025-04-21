import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Select,
  MenuItem, // 🔹 추가
  FormControl,
  InputLabel
} from "@mui/material";
import { buttonStyle } from "../../../components/common/Styles";
import CustomTextField from "../../../components/common/CustomTextField";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState(""); // 🔹 추가 (이름 필드)
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [userType, setUserType] = useState("regular"); // 🔹 기본값은 일반 사용자
  const [error, setError] = useState(""); // 🔹 백엔드 에러 메시지 상태 추가
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [timer, setTimer] = useState(180); 
  const [code, setCode] = useState(""); 

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
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!code) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }
    setError(""); // 🔹 에러 초기화

    try {
      const response = await axios.post("https://eventcafe.site/user/register/", {
        username,
        email,
        password,
        user_type: userType // 🔹 추가
      });

      console.log("회원가입 성공:", response.data);
      alert("회원가입 성공! 로그인하세요.");
      window.location.href = "/login";
    } catch (err) {
      console.error("회원가입 실패:", err.response?.data);
      setError(err.response?.data?.error || "회원가입 실패. 다시 시도해주세요.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("https://eventcafe.site/user/verify-email-code/", {
        email,
        code
      });
      alert("✅ 이메일 인증이 완료되었습니다!");
    } catch (err) {
      console.error("인증 실패:", err.response?.data);
      setError("❌ 인증 코드가 잘못되었거나 만료되었습니다.");
    }
  };

  const handleSendVerification = async () => {
    setShowEmailVerification(true);
    setTimer(300);

    try {
      const response = await axios.post("https://eventcafe.site/user/send-email-verification/", {
        email,
      });
      console.log("인증 코드 전송 성공:", response.data);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } catch (err) {
      console.error("인증 코드 전송 실패:", err.response?.data);
      setError("인증 코드 전송에 실패했습니다.");
    }
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

        {error && (
          <Typography color="error" textAlign="center" sx={{ marginBottom: "1rem" }}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <CustomTextField label="이름" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTextField label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button
              variant="outlined"
              onClick={handleSendVerification}
              sx={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                borderRadius: "6px",
                color: "#007BFF",
                borderColor: "#007BFF",
                "&:hover": { backgroundColor: "#e6f4ff" },
              }}
            >
              인증
            </Button>
          </Box>

          {showEmailVerification && (
            <Box>
              <TextField
                label="인증 코드"
                type="text"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}  // ✅ 입력값 받기
                sx={{ marginBottom: "0.5rem" }}
              />
              <Typography variant="body2" textAlign="right" color={timer > 0 ? "#555555" : "#FF0000"}>
                {timer > 0 ? `남은 시간: ${formatTime(timer)}` : "인증 시간이 만료되었습니다."}
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleVerifyCode}  // 여기서 인증 검사!
                sx={{ mt: 1, fontWeight: "bold", color: "#007BFF", borderColor: "#007BFF" }}
              >
                인증 확인
              </Button>
            </Box>
          )}

          {/* 🔹 사용자 유형 선택 추가 */}
          <FormControl fullWidth>
            <InputLabel>사용자 유형</InputLabel>
            <Select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <MenuItem value="regular">일반 사용자</MenuItem>
              <MenuItem value="organizer">주최측</MenuItem>
            </Select>
          </FormControl>

          <CustomTextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> {/* showpassword 해서 비밀번호 * 처리하고 보안성 높이는 게 좋을 듯 */}
          <CustomTextField
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button variant="contained" fullWidth onClick={handleSignup} sx={buttonStyle}>
            회원가입
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ color: "#555555", marginTop: "1rem" }}>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" underline="hover" sx={{ color: "#007BFF", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}>
              로그인
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
