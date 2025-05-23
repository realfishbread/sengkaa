import {
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';

const BirthdayCafeDetailPage = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/events/birthday-cafes/${id}/`
        );
        setCafe(response.data);
      } catch (error) {
        console.error('이벤트 상세 불러오기 실패:', error);
      }
    };

    fetchCafeDetail();
  }, [id]);

  if (!cafe) return <Typography>불러오는 중...</Typography>;

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {cafe.cafe_name}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="400"
          image={cafe.image}
          alt={cafe.cafe_name}
        />
      </Card>

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
  );
};

export default BirthdayCafeDetailPage;
