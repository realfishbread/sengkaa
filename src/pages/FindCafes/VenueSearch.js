// VenueSearchPage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

const dummyVenues = [
  {
    id: 1,
    name: '핑크무드 카페',
    location: '서울 강남',
    image: 'https://via.placeholder.com/400x200',
    rentalFee: 30000,
    availableDate: '2025-06-10',
    type: '카페',
  },
  {
    id: 2,
    name: '파티룸 리틀블랙',
    location: '부산 해운대',
    image: 'https://via.placeholder.com/400x200',
    rentalFee: 50000,
    availableDate: '2025-06-15',
    type: '파티룸',
  },
];

const VenueSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venueType, setVenueType] = useState('');

  const handleVenueTypeChange = (event, newType) => {
    setVenueType(newType);
  };

  const filteredVenues = dummyVenues.filter((venue) => {
    const matchKeyword = keyword === '' || venue.name.includes(keyword);
    const matchType = venueType === '' || venue.type === venueType;
    const matchStart = startDate === '' || venue.availableDate >= startDate;
    const matchEnd = endDate === '' || venue.availableDate <= endDate;
    return matchKeyword && matchType && matchStart && matchEnd;
  });

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
              {['카페', '음식점', '전시회', '포토부스', '파티룸'].map((type) => (
                <ToggleButton key={type} value={type}>{type}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Box>

      {/* 대관 장소 카드 리스트 */}
      <Grid container spacing={3}>
        {filteredVenues.map((venue) => (
          <Grid item xs={12} sm={6} md={4} key={venue.id}>
            <Card>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VenueSearch;
