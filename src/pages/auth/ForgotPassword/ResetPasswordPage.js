import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/passwordApi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const email = useLocation().state?.email || "";

  const handleReset = async () => {
    try {
      await resetPassword(email, password);
      alert("비밀번호가 변경되었습니다!");
      navigate("/login/");
    } catch (e) {
      alert("변경 실패: " + (e.response?.data?.error || "알 수 없는 에러"));
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
          새 비밀번호 입력
        </Typography>

        <Typography variant="body2" mb={1}>
          이메일: {email}
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="새 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleReset}>
          비밀번호 변경
        </Button>
      </Container>
    </Box>
  );
}
