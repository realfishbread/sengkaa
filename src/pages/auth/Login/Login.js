import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import axios from 'axios'; // axiosInstance 말고 기본 axio
import React, { useContext, useState } from 'react'; // ✅ 이렇게 해야 함
import { SiKakaotalk } from 'react-icons/si'; // 카카오톡 아이콘
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../../components/common/CustomTextField';
import { buttonStyle } from '../../../components/common/Styles';
import { UserContext } from '../../../context/UserContext';

const LoginPage = ({ isModal = false }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const KAKAO_REST_API_KEY = '4083ddda8b18709f62bb857f2c52f127';
  const REDIRECT_URI =
    'https://eventcafe.site/user/social/oauth/kakao/callback';
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        'https://eventcafe.site/user/auth/login/',
        {
          email,
          password,
        }
      );

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          nickname: data.nickname,
          username: data.username,
          email: data.email,
          profile_image: data.profile_image_url,
          star: data.star,
          bio: data.bio,
        })
      ); // ✅ 추가
      setUser({
        nickname: data.nickname,
        username: data.username,
        email: data.email,
        profile_image: data.profile_image_url,
        star: data.star,
        bio: data.bio,
      });
      window.location.reload(); // 강제 새로고침
      navigate('/'); // 홈으로
    } catch (err) {
      const serverMessage =
        err.response?.data?.error || // ✅ 너가 백에서 보내주는 키
        err.response?.data?.detail || // DRF 기본 키
        '알 수 없는 오류가 발생했습니다.';

      alert('로그인 실패: ' + serverMessage);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = kakaoLoginUrl;
  };

  

  return (
    <Box
      sx={{
        ...(isModal
          ? {} // 모달일 땐 배경, 정렬 제거
          : {
              backgroundImage: 'linear-gradient(to bottom, #cfeffd, #a3d9ff)',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }),
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: '#ffffff', // ✅ 진짜 흰색으로 고정
          boxShadow: isModal ? 'none' : '0 6px 18px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* 로고 섹션 - 로고 대신 '<' 아이콘 버튼만 추가 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start', // 왼쪽 정렬
            marginBottom: '1.5rem',
          }}
        >
          <IconButton onClick={() => navigate(-1)} size="large">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* 제목 */}
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 'bold',
            color: '#333333',
            marginBottom: '1.5rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
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
            display: 'flex',
            flexDirection: 'column',
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
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#007BFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0056b3',
                },
              },
            }}
          />

          <CustomTextField
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#007BFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0056b3',
                },
              },
            }}
          />

          <Button
            type="submit" // ✅ 여기!!
            variant="contained"
            fullWidth
            sx={buttonStyle}
          >
            로그인
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: '#555555' }}
          >
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              underline="none"
              sx={{
                color: '#007BFF',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#0056b3',
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
            borderColor: '#E0E0E0',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            SNS로 로그인하기
          </Typography>
        </Divider>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Button
            fullWidth
            onClick={handleKakaoLogin}
            sx={{
              backgroundColor: '#FEE500',
              color: '#3C1E1E',
              padding: '10px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              borderRadius: '6px',
              boxShadow: '0 3px 9px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#e3d100',
                transform: 'scale(1.02)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <SiKakaotalk size={18} style={{ marginRight: '8px' }} />
            카카오로 로그인
          </Button>
          
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
