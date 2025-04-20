import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendResetEmail } from "../api/passwordApi";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export default function RequestCodePage() {
  const [email, setEmail] = useState("");
  const navigate          = useNavigate();

  const handleSend = async () => {
    try {
      await sendResetEmail(email);
      alert("인증 코드가 전송되었습니다.");
      navigate("/verify-code/", { state: { email } });
    } catch (e) {
      alert("오류: " + (e.response?.data?.error || "알 수 없는 에러"));
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
        p: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.9)",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          비밀번호 재설정
        </Typography>

        <TextField
          fullWidth
          label="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleSend}>
          인증 코드 받기
        </Button>
      </Container>
    </Box>
  );
}
