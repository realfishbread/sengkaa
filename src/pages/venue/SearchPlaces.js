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
import React, { useEffect, useState } from 'react';
import { EventSearchApi } from './api/EventSearchApi';

const SearchPlaces = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genre, setGenre] = useState('');
  const [events, setEvents] = useState([]); // ✅ 바뀐 데이터 저장용

  const handleGenreChange = (event, newGenre) => setGenre(newGenre);

  // 🔥 필터 변경될 때마다 API 호출
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await EventSearchApi({
          keyword,
          startDate,
          endDate,
          genre,
        });

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]); // 🚨 혹시라도 results 빠졌을 때 대비
        }
      } catch (err) {
        console.error('이벤트 불러오기 실패:', err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [keyword, startDate, endDate, genre]);
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
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={event.image} // image 필드로 맞춰줘야 해
                alt={event.cafe_name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.cafe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 {event.start_date} ~ {event.end_date}
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
