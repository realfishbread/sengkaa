import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundBox from '../../components/common/NotFoundBox';
import { EventSearchApi } from './api/EventSearchApi';

import './SearchPlaces.css';

const SearchPlaces = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genre, setGenre] = useState('');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const handleGenreChange = (event, newGenre) => {
    setGenre(newGenre || '');
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await EventSearchApi({ keyword, startDate, endDate, genre });

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
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

        {/* 장르 필터 */}
        <Box mt={3}>
          <ToggleButtonGroup
            value={genre}
            exclusive
            onChange={handleGenreChange}
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid #ddd',
                borderRadius: '20px',
                minWidth: '60px',
                fontWeight: 'bold',
                px: 2,
                py: 0.5,
                color: '#333',
              },
              '& .Mui-selected': {
                backgroundColor: '#f0f0f0',
                color: '#000',
                borderColor: '#999',
              },
            }}
          >
            {['아이돌', '유튜버', '웹툰', '게임', '애니'].map((label) => (
              <ToggleButton key={label} value={label}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* 카드 리스트 */}
      <Grid container spacing={3}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={6} key={event.id}>
              <Card
                onClick={() => navigate(`/birthday-cafes/${event.id}`)}
                className="event-card-container"
                sx={{ cursor: 'pointer' }}
              >
                <CardContent className="event-card-content">
                  <Box className="event-card-inner">
                    {/* 왼쪽 이미지 */}
                    <Box className="event-card-left">
                      <img
                        src={event.image}
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
                          {event.is_liked ? (
                            <BookmarkIcon
                              sx={{ color: '#ff4081', cursor: 'pointer' }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <BookmarkBorderIcon
                              sx={{ color: '#ccc', cursor: 'pointer' }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <ShareIcon
                            sx={{ color: '#ccc', ml: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const url = `${window.location.origin}/user/event/birthday-cafes/${event.id}/`;
                              navigator.clipboard
                                .writeText(url)
                                .then(() => alert('링크가 복사되었습니다!'))
                                .catch(() => alert('복사 실패 😢'));
                            }}
                          />
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 'bold', fontStyle: 'italic', mb: 1 }}
                      >
                        {event.cafe_name || '이벤트명'}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        📍 {event.road_address || '상세 위치 없음'}{' '}
                        {event.detail_address || ''}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        📅 {event.start_date} ~ {event.end_date}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {event.genre && (
                          <Chip label={event.genre} size="small" className="event-card-chip" />
                        )}
                        {event.tags?.map((tag, i) => (
                          <Chip key={i} label={tag} size="small" className="event-tag-chip" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <NotFoundBox />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SearchPlaces;
