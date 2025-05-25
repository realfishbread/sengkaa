// VenueSearchPage.js
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VenueSearchApi } from './VenueSearchApi';

const VenueSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venueType, setVenueType] = useState('');
  const [venues, setVenues] = useState([]); // ✅ venues 상태 추가
  const navigate = useNavigate();

  const handleVenueTypeChange = (event, newType) => {
    setVenueType(newType);
  };

  // 🔥 keyword, startDate, endDate, venueType가 바뀔 때마다 API 호출
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await VenueSearchApi({
          keyword,
          venueType,
          startDate,
          endDate,
        });
        setVenues(data);
      } catch (error) {
        console.error('대관 장소 불러오기 실패:', error);
      }
    };

    fetchVenues();
  }, [keyword, startDate, endDate, venueType]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        대관 공간 찾기
      </Typography>
      {/* 필터 영역 */}
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="장소명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="이용 시작일"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="이용 종료일"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ToggleButtonGroup
              value={venueType}
              exclusive
              onChange={handleVenueTypeChange}
              sx={{ '& .MuiToggleButton-root': { mr: 1 } }}
            >
              {['카페', '음식점', '전시회', '포토부스', '파티룸'].map(
                (type) => (
                  <ToggleButton key={type} value={type}>
                    {type}
                  </ToggleButton>
                )
              )}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Box>
      {/* 대관 장소 카드 리스트 */}
      <Grid container spacing={3}>
        {venues.map((venue) => (
          <Grid item xs={12} sm={6} md={4} key={venue.id}>
            <Card
              onClick={() => navigate(`/venues/${venue.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                height="180"
                image={venue.image}
                alt={venue.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {venue.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {venue.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  💰 ₩{venue.rentalFee.toLocaleString()} / 시간
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 가능일: {venue.availableDate}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                >
                  <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {venue.view_count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VenueSearch;
