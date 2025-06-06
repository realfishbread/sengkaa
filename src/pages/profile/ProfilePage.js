import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFoundBox from '../../components/common/NotFoundBox';
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
        <NotFoundBox />

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
          뒤로 돌아가기
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

        {/* 자기소개(bio)가 있을 때만 보여주기 */}
        {profile.bio && (
          <>
            <br />
            <br />
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ textAlign: 'center', color: '#6C63FF', mb: 1 }}
            >
              📝 자기소개
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-line', textAlign: 'center' }}
            >
              {profile.bio}
            </Typography>
          </>
        )}
        <br />
        <br />
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ fontSize: 15 }}
        >
          가입일: {new Date(profile.created_at).toLocaleDateString()}
        </Typography>

        {/* ⭐ 여기에 최애 스타 추가 */}
        {profile.star && (
          <>
            <Divider sx={{ my: 4, borderColor: '#eee' }} />
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ textAlign: 'center', color: '#6C63FF', mb: 1 }}
            >
              ⭐ 최애 스타
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                mt: 1,
              }}
            >
              <img
                src={profile.star.image}
                alt={profile.star.name}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #6C63FF',
                }}
              />
              <Typography variant="body1" fontWeight="bold" color="#333">
                {profile.star.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.star.group}
              </Typography>
            </Box>
          </>
        )}
       
        

        {/* 프로필 주인 여부 체크 */}
        {isMyProfile ? (
          <>
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
            <br />
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
                mb: 4,
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
       <br />
    </Box>
    
  );
};

export default ProfilePage;
