import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';

const StarDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchStarData = async () => {
      try {
        const [starRes, eventsRes] = await Promise.all([
          axiosInstance.get(`/user/star/stars/${id}/`),
          axiosInstance.get(`/user/events/birthday-cafes/`, {
            params: { star_id: id }
          })
        ]);

        setStar(starRes.data);
        setEvents(eventsRes.data.results || []);
      } catch (error) {
        console.error('스타 정보 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStarData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!star) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>스타 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const upcomingEvents = events.filter(event => new Date(event.end_date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.end_date) < new Date());

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* 왼쪽 이미지 섹션 */}
        <Box sx={{ flex: '0 0 45%' }}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
            <CardMedia
              component="img"
              image={star.image}
              alt={star.name}
              sx={{ 
                width: '100%',
                height: '600px',
                objectFit: 'cover'
              }}
            />
          </Card>
        </Box>

        {/* 오른쪽 정보 섹션 */}
        <Box sx={{ flex: '1 1 55%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h3" fontWeight="bold" color="#333">
              {star.name}
            </Typography>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>장르</Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 2,
                    backgroundColor: '#f5f5f5',
                    borderColor: '#e0e0e0',
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      borderColor: '#e0e0e0'
                    }
                  }}
                >
                  {star.group}
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>생년월일</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {star.birthday}
              </Typography>
            </Box>
          </Box>

          {/* 진행/예정 생일카페 섹션 */}
          <Box sx={{ 
            mt: 6,
            p: 3, 
            bgcolor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              진행/예정 생일카페({upcomingEvents.length})
            </Typography>
            {upcomingEvents.length > 0 ? (
              <Grid container spacing={2}>
                {upcomingEvents.map((event) => (
                  <Grid item xs={12} sm={6} key={event.id}>
                    <Card sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}>
                      <CardMedia
                        component="img"
                        image={event.image_url}
                        alt={event.cafe_name}
                        sx={{ height: 200, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {event.start_date} ~ {event.end_date}
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {event.cafe_name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                p: 3,
                bgcolor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}>
              </Box>
            )}
          </Box>

          {/* 지난 생일카페 섹션 */}
          {pastEvents.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                지난 생일카페({pastEvents.length})
              </Typography>
              <Grid container spacing={2}>
                {pastEvents.map((event) => (
                  <Grid item xs={12} sm={6} key={event.id}>
                    <Card sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}>
                      <CardMedia
                        component="img"
                        image={event.image_url}
                        alt={event.cafe_name}
                        sx={{ height: 200, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {event.start_date} ~ {event.end_date}
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {event.cafe_name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default StarDetailPage; 