import {
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

const BirthdayCafeDetailPage = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        const response = await axios.get(
          `https://eventcafe.site/user/events/birthday-cafes/${id}/`
        );
        setCafe(response.data);
        setIsLiked(response.data.is_liked);
        setLikeCount(response.data.liked_count || 0);
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
    }
  };

  if (!cafe) return <Typography>불러오는 중...</Typography>;

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Card sx={{ 
              width: '100%',
              maxWidth: '400px',
              mb: 4,
              bgcolor: 'transparent',
              boxShadow: 'none'
            }}>
              <Box sx={{ 
                position: 'relative',
                paddingTop: '170%', // 1:1.7 비율로 수정
                width: '100%'
              }}>
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
                    objectPosition: 'top'
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
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
                <Typography>
                  {cafe.road_address} {cafe.detail_address}
                </Typography>
              </Grid>
            </Grid>

            {cafe.star && (
              <Box mt={4}>
                <Typography variant="h6">최애 스타</Typography>
                <Box display="flex" alignItems="center" gap={2} mt={1}>
                  <img
                    src={cafe.star.image}
                    alt={cafe.star.name}
                    width={80}
                    style={{ borderRadius: 10 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{cafe.star.name}</Typography>
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
    </Box>
  );
};

export default BirthdayCafeDetailPage;
