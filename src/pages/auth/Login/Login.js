import React, { useState, useContext  } from "react"; // ✅ 이렇게 해야 함
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
import Logo from "../../../components/common/Logo";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import axios from "axios"; // axiosInstance 말고 기본 axio
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";




const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  

  const KAKAO_REST_API_KEY = '4083ddda8b18709f62bb857f2c52f127';
  const REDIRECT_URI = 'https://eventcafe.site/user/oauth/kakao/callback';
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

 

  

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("https://eventcafe.site/user/login/", {
        email,
        password
      });
  
      
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userInfo", JSON.stringify({
        username: data.username,
        email: data.email,
        profile_image: data.profile_image,
      })); // ✅ 추가
      setUser({
        username: data.username,
        email: data.email,
        profile_image: data.profile_image,
      });
      navigate("/");            // 홈으로
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  };


  const handleKakaoLogin = () => {
    window.location.href = kakaoLoginUrl;
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
          <Logo />
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
          onSubmit={(e) => {
            e.preventDefault(); // 폼 제출 기본 동작 방지
            handleLogin(); // 로그인 함수 호출
          }}
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
          type={showPassword ? "text" : "password"}
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
            type="submit"  // ✅ 여기!!
            variant="contained"
            fullWidth
            sx={buttonStyle}
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
            <Typography variant="body2" textAlign="center" sx={{ mt: 0.5 }}>
              <Link href="/forgot-password/" underline="hover">
                비밀번호를 잊으셨나요?
              </Link>
            </Typography>
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
