// pages/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@mui/material';

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get('query');

  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 검색어가 숫자인 경우 스타 상세 페이지로 직접 이동
        if (!isNaN(query) && query.trim() !== '') {
          navigate(`/star/${query}`);
          return;
        }

        // 스타 검색 결과 먼저 확인
        const starRes = await axiosInstance.get(`/user/star/stars/?keyword=${query}`);
        
        // 정확히 일치하는 스타가 있는 경우 바로 이동
        if (starRes.data.length === 1 && 
            starRes.data[0].display.replace(/\s+/g, '') === query.replace(/\s+/g, '')) {
          navigate(`/star/${starRes.data[0].id}`);
          return;
        }

        // 일치하는 스타가 없거나 여러 명인 경우 검색 결과 표시
        setStars(starRes.data);

        // 나머지 검색 결과 가져오기
        const [eventRes, venueRes] = await Promise.all([
          axiosInstance.get(`/user/events/birthday-cafes/search/`, {
            params: { keyword: query },
          }),
          axiosInstance.get(`/user/venues/search/`, {
            params: { keyword: query },
          }),
        ]);

        setEvents(eventRes.data.results || []);
        setVenues(venueRes.data.results || []);
      } catch (err) {
        console.error('검색 실패 ❌', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchData();
  }, [query, navigate]);

  const handleStarClick = (starId) => {
    navigate(`/star/${starId}`);
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        🔍 "{query}" 검색 결과
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* 스타 결과 */}
      {stars.length > 0 && (
        <>
          <Typography variant="h6">⭐ 관련된 스타</Typography>
          <Grid container spacing={2} mt={1}>
            {stars.map((star) => (
              <Grid item xs={6} sm={4} md={3} key={star.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardActionArea onClick={() => handleStarClick(star.id)}>
                    <CardMedia
                      component="img"
                      image={star.image}
                      alt={star.display}
                      sx={{ 
                        aspectRatio: '1',
                        objectFit: 'cover'
                      }}
                    />
                    <CardContent>
                      <Typography align="center">{star.display}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* 이벤트 결과 */}
      {events.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6">🎂 관련된 이벤트</Typography>
          <Grid container spacing={2} mt={1}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Box>
                  <img
                    src={event.image_url}
                    alt={event.cafe_name}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <Typography mt={1}>{event.cafe_name}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* 장소 결과 */}
      {venues.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6">📍 관련된 대관 장소</Typography>
          <Grid container spacing={2} mt={1}>
            {venues.map((venue) => (
              <Grid item xs={12} sm={6} md={4} key={venue.id}>
                <Box>
                  <img
                    src={venue.image}
                    alt={venue.name}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <Typography mt={1}>{venue.name}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {stars.length === 0 && events.length === 0 && venues.length === 0 && (
        <Typography mt={4} color="gray">
          검색 결과가 없습니다.
        </Typography>
      )}
    </Box>
  );
};

export default SearchResults;
