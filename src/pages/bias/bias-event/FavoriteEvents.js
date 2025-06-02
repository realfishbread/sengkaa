import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/api/axiosInstance';
import './FavoriteEvents.css';

const FavoriteEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/user/events/liked/')
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error('찜한 이벤트 불러오기 실패 ❌', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLikeToggle = async (eventId, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(`/user/events/${eventId}/like/`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('찜 취소 실패:', err);
    }
  };

  const handleShare = (eventId, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/birthday-cafes/${eventId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert('링크가 복사되었습니다!'))
      .catch(() => alert('복사 실패 😢'));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ❤️ 찜한 이벤트
      </Typography>

      {events.length === 0 ? (
        <Box
          sx={{
            border: '1px dashed #ccc',
            borderRadius: '12px',
            padding: 4,
            textAlign: 'center',
            backgroundColor: '#fafafa',
            mt: 10,
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 50, color: '#ff8ba7' }} />
          <Typography variant="h6" mt={2}>
            찜한 이벤트가 아직 없어요
          </Typography>
          <Typography variant="body2" color="text.secondary">
            마음에 드는 이벤트를 하트로 저장해보세요 💖
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} key={event.id}>
              <Card
                onClick={() => window.location.href = `https://eventcafe.site/user/events/birthday-cafes/${event.id}/`}
                className="event-card-container"
                sx={{ cursor: 'pointer' }}
              >
                <CardContent className="event-card-content">
                  <Box className="event-card-inner">
                    {/* 왼쪽 이미지 */}
                    <Box className="event-card-left">
                      <img
                        src={event.image_url}
                        alt={event.cafe_name}
                        className="event-poster"
                      />
                    </Box>

                    {/* 오른쪽 정보 */}
                    <Box className="event-card-right">
                      <Box className="event-card-header">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {event.star_display || '아티스트/그룹명'}
                        </Typography>
                        <Box className="event-card-header-icons">
                          <FavoriteIcon
                            sx={{ color: '#ff4081', cursor: 'pointer' }}
                            onClick={(e) => handleLikeToggle(event.id, e)}
                          />
                          <ShareIcon
                            sx={{ color: '#ccc', ml: 1 }}
                            onClick={(e) => handleShare(event.id, e)}
                          />
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 'bold', fontStyle: 'italic', mb: 1 }}
                      >
                        {event.cafe_name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        📍 {event.road_address || '상세 위치 없음'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        📅 {event.start_date} ~ {event.end_date}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoriteEvents;
