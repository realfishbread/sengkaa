// EventSearchPage.js
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
import React, { useState } from 'react';

const dummyEvents = [
  {
    id: 1,
    name: '뉴진스 팬카페 이벤트',
    date: '2025-06-15',
    location: '서울 홍대',
    genre: '아이돌',
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 2,
    name: '침착맨 팬미팅',
    date: '2025-06-20',
    location: '부산 서면',
    genre: '유튜버',
    image: 'https://via.placeholder.com/400x200',
  },
];

const SearchPlaces = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genre, setGenre] = useState('');

  const handleGenreChange = (event, newGenre) => {
    setGenre(newGenre);
  };

  const filteredEvents = dummyEvents.filter((event) => {
    const matchKeyword = keyword === '' || event.name.includes(keyword);
    const matchGenre = genre === '' || event.genre === genre;
    const matchStart = startDate === '' || event.date >= startDate;
    const matchEnd = endDate === '' || event.date <= endDate;
    return matchKeyword && matchGenre && matchStart && matchEnd;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        이벤트 찾기
      </Typography>

      {/* 필터 영역 */}
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="이벤트명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="시작일"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="종료일"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <ToggleButtonGroup
            value={genre}
            exclusive
            onChange={handleGenreChange}
            sx={{ '& .MuiToggleButton-root': { mr: 1 } }}
          >
            <ToggleButton value="아이돌">아이돌</ToggleButton>
            <ToggleButton value="유튜버">유튜버</ToggleButton>
            <ToggleButton value="웹툰">웹툰</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* 이벤트 카드 리스트 */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={event.image}
                alt={event.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 {event.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchPlaces;
