import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/api/axiosInstance';

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
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  (window.location.href = `https://eventcafe.site/user/events/birthday-cafes/${event.id}/`)
                }
              >
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
      )}
    </Box>
  );
};

export default FavoriteEvents;
