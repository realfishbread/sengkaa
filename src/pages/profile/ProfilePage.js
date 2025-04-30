import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';

const ProfilePage = () => {
  const { nickname } = useParams();
  const { user } = useContext(UserContext); // ✅ 로그인된 유저
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/user/profile/${nickname}/`)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [nickname]);

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );

    if (!profile)
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh', // 너무 바닥 붙지 않게 조절
            px: 2,
            textAlign: 'center',
          }}
        >
          {/* 🐱 귀여운 일러스트 이미지 삽입 */}
          <Box
            component="img"
            src="/images/error-cat.png" // 👉 public/images 폴더에 넣어두면 됨
            alt="에러 이미지"
            sx={{ maxWidth: 300, mb: 4 }}
          />
    
          <Typography variant="h6" fontWeight="bold" color="error" mb={1}>
            😢 사용자 정보를 찾을 수 없어요!
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            입력한 닉네임이 잘못되었거나, 서버에서 정보를 불러오지 못했어요.
          </Typography>
    
          <Button
            variant="contained"
            onClick={() => navigate(-1)} // 👉 뒤로 가기
            sx={{
              mt: 2,
              backgroundColor: '#6C63FF',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '12px',
              px: 4,
              py: 1.2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#5a55d3',
              },
            }}
          >
            🔙 돌아가기
          </Button>
        </Box>
      );
    

  const isMyProfile = user?.nickname === profile.nickname; // ✅ 비교!

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f9f9f9, #ffffff)',
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <Avatar
          src={profile.profile_image}
          alt={profile.nickname}
          sx={{
            width: 110,
            height: 110,
            mx: 'auto',
            mb: 2,
            border: '3px solid #6C63FF',
            backgroundColor: '#e0e0e0',
          }}
        />
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          color="#333"
        >
          {profile.nickname}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          mt={1}
        >
          {profile.email}
        </Typography>

        <Divider sx={{ my: 4, borderColor: '#eee' }} />

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ fontSize: 15 }}
        >
          가입일: {new Date(profile.created_at).toLocaleDateString()}
        </Typography>

        {/* 프로필 주인 여부 체크 */}
        {isMyProfile ? (
          <>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              {profile.email}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                backgroundColor: '#6C63FF',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#5a55d3',
                },
              }}
              onClick={() => navigate('/edit-profile')}
            >
              ✏️ 프로필 수정
            </Button>
          </>
        ) : (
          <>
            {/* 남 프로필이면 이메일 숨기고 */}
            <Typography
              variant="subtitle2"
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              이 사용자가 작성한 게시글을 확인할 수 있어요
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                borderColor: '#6C63FF',
                color: '#6C63FF',
                fontWeight: 'bold',
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f4f4ff',
                },
              }}
              onClick={() => navigate(`/user/posts/${profile.nickname}`)}
            >
              📃 이 사용자 글 보기
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
