import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoginConfirmDialog from '../../components/common/LoginConfirmDialog';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';

const BirthdayCafeDetailPage = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [askLogin, setAskLogin] = useState(false);

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        const response = await axios.get(
          `https://eventcafe.site/user/events/birthday-cafes/${id}/`
        );
         console.log('받은 데이터:', response.data); // 🧪 디버깅
        setCafe(response.data);
        setIsLiked(response.data.is_liked);
        setLikeCount(response.data.like_count || 0);
      } catch (error) {
        console.error('이벤트 상세 불러오기 실패:', error);
      }
    };

    fetchCafeDetail();
  }, [id]);

  const handleLikeToggle = async () => {
    try {
      await axiosInstance.post(`/user/events/${id}/like/`);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error('찜 실패:', error);
      if (error.response?.status === 403) {
        console.warn('로그인 필요!');
        if (!user) {
          // loading 끝난 뒤에만 질문
          setAskLogin(true); // 모달 오픈
        } else {
          alert('찜에 실패하였습니다. 다시 시도해주세요.');
        }
      }
      // 에러는 axiosInstance의 인터셉터에서 처리됨
    }
  };

  if (!cafe) return <Typography>불러오는 중...</Typography>;

  return (
    <>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  mb: 4,
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '170%', // 1:1.7 비율로 수정
                    width: '100%',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={cafe.image}
                    alt={cafe.cafe_name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'top',
                    }}
                  />
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {cafe.cafe_name}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={handleLikeToggle} color="error">
                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography>{likeCount}</Typography>
                </Box>
              </Box>

              <Typography variant="body1" gutterBottom>
                {cafe.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">장르</Typography>
                  <Chip label={cafe.genre} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">조회수</Typography>
                  <Typography>{cafe.view_count}회</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">날짜</Typography>
                  <Typography>
                    {cafe.start_date} ~ {cafe.end_date}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">장소</Typography>
                  <Typography>{cafe.road_address}</Typography>
                </Grid>
              </Grid>

              {cafe.star && (
                <Box mt={4}>
                  <Typography variant="h6">스타</Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <img
                      src={cafe.star.image}
                      alt={cafe.star.name}
                      width={80}
                      style={{ borderRadius: 10 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {cafe.star.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cafe.star.group}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {cafe.goods && cafe.goods.length > 0 && (
          <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🎁 현장 굿즈
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              이벤트 현장에서 만날 수 있는 굿즈를 소개해요!
            </Typography>
            <Grid container spacing={2}>
              {cafe.goods.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', // ✅ 부드러운 그림자
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)', // ✅ 살짝 확대되는 효과
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 2,
                      }}
                    />
                    <Box mt={2} textAlign="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        💸 {item.price.toLocaleString()}원
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <LoginConfirmDialog
        open={askLogin}
        onClose={() => setAskLogin(false)} // 취소
        onConfirm={
          () => navigate('/login', { state: { from: '/birthday-cafes/:id' } }) // 로그인
        }
      />
    </>
  );
};

export default BirthdayCafeDetailPage;
