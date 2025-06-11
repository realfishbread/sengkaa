// 필요한 import들은 그대로 유지
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginConfirmDialog from '../../components/common/LoginConfirmDialog';
import NotFoundBox from '../../components/common/NotFoundBox';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';
import { EventSearchApi } from './api/EventSearchApi';
import './SearchPlaces.css';

const SearchPlaces = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genreLabel, setGenreLabel] = useState('');
  const [sort, setSort] = useState('');
  const [events, setEvents] = useState([]);
  const [askLogin, setAskLogin] = useState(false);
  const { user } = useContext(UserContext);
  const [isWide, setIsWide] = useState(false);
  const navigate = useNavigate();

  

  const GENRE_MAP = {
    아이돌: 'idol,boy_idol', // ✅ 복수 genre
    유튜버: 'youtuber',
    웹툰: 'webtoon',
    게임: 'game',
    애니: 'anime',
  };

  const GENRE_ID_MAP = {
    1: 'idol',
    2: 'youtuber',
    3: 'anime',
    4: 'webtoon',
    5: 'game',
    6: 'idol', // boy_idol 포함
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await EventSearchApi({
          keyword,
          startDate,
          endDate,
          genre: GENRE_MAP[genreLabel] || '',
          sort,
        });

        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('이벤트 불러오기 실패:', err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [keyword, startDate, endDate, genreLabel, sort]);

  

  const today = new Date();

  const { upcomingEvents, ongoingEvents, pastEvents } = useMemo(() => {
    const parsed = events.map((e) => ({
      ...e,
      start_date_obj: new Date(e.start_date),
      end_date_obj: new Date(e.end_date),
    }));

    return {
      upcomingEvents: parsed.filter((e) => e.start_date_obj > today),
      ongoingEvents: parsed.filter(
        (e) => e.start_date_obj <= today && e.end_date_obj >= today
      ),
      pastEvents: parsed.filter((e) => e.end_date_obj < today),
    };
  }, [events]);

  const handleLikeToggle = async (eventId, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(`/user/events/${eventId}/like/`);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, is_liked: !e.is_liked } : e
        )
      );
    } catch (err) {
      if (err.response?.status === 403 && !user) {
        setAskLogin(true);
      } else {
        alert('찜에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const renderEventCards = (list) => {
    if (!list || list.length === 0) {
      return (
        <Grid item xs={12}>
          <NotFoundBox />
        </Grid>
      );
    }

 
    return list.map((event) => (
      <Grid item xs={12} sm={6} md={6} key={event.id}>
        <Card
          onClick={() => navigate(`/birthday-cafes/${event.id}`)}
          className="event-card-container"
          sx={{ cursor: 'pointer' }}
        >
          <CardContent className="event-card-content">
            <Box className="event-card-inner">
              <Box className="event-card-left">
                <img
                  src={event.image}
                  alt={event.cafe_name}
                  className="event-poster"
                />
              </Box>
              <Box className="event-card-right">
                <Box className="event-card-header">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.star_display || '아티스트/그룹명'}
                  </Typography>
                  <Box className="event-card-header-icons">
                    {event.is_liked ? (
                      <FavoriteIcon
                        sx={{ color: '#ff4081 !important', cursor: 'pointer' }}
                        onClick={(e) => handleLikeToggle(event.id, e)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ color: '#ccc', cursor: 'pointer' }}
                        onClick={(e) => handleLikeToggle(event.id, e)}
                      />
                    )}
                    <ShareIcon
                      sx={{ color: '#ccc', ml: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `${window.location.origin}/birthday-cafes/${event.id}`;
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
                  fontWeight="bold"
                  fontStyle="italic"
                  mb={1}
                >
                  {event.cafe_name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  📍 {event.road_address}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  📅 {event.start_date} ~ {event.end_date}
                </Typography>

                <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {event.genre && (
                    <Chip
                      label={GENRE_ID_MAP[event.genre] || event.genre}
                      size="small"
                    />
                  )}
                  {event.tags?.map((tag, i) => (
                    <Chip key={i} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          이벤트 찾기
        </Typography>

        {/* 필터 */}
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
              value={genreLabel}
              exclusive
              onChange={(e, newLabel) => setGenreLabel(newLabel || '')}
              sx={{
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '20px',
                  minWidth: '60px',
                  fontWeight: 'bold',
                  px: 2,
                  py: 0.5,
                  color: '#999',
                  backgroundColor: '#f5f5f5',
                  '&.Mui-selected': {
                    color: '#fff',
                    backgroundColor: '#ff4081',
                  },
                  '&:hover': {
                    backgroundColor: '#ffe1ec',
                  },
                },
              }}
            >
              {Object.keys(GENRE_MAP).map((label) => (
                <ToggleButton key={label} value={label}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* 정렬 필터 */}
        <Box mt={1}>
          <ToggleButtonGroup
            value={sort}
            exclusive
            onChange={(e, newSort) => setSort(newSort || '')}
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontWeight: 'bold',
                px: 2,
                py: 0.5,
                color: '#333',
              },
              '& .Mui-selected': {
                backgroundColor: '#dff0ff',
                color: '#000',
                borderColor: '#3399ff',
              },
            }}
          >
            <ToggleButton value="latest">최신순</ToggleButton>
            <ToggleButton value="likes">좋아요순</ToggleButton>
            <ToggleButton value="views">조회수순</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 진행중 */}
        <Typography variant="h5" mt={5} mb={1} fontWeight="bold">
          🎉 지금 진행 중인 이벤트
        </Typography>
        <Grid container spacing={3}>
          {renderEventCards(ongoingEvents)}
        </Grid>

        {/* 다가오는 */}
        <Typography variant="h5" mt={5} mb={1} fontWeight="bold">
          🕒 다가오는 이벤트
        </Typography>
        <Grid container spacing={3}>
          {renderEventCards(upcomingEvents)}
        </Grid>

        {/* 지난 */}
        <Typography variant="h5" mt={5} mb={1} fontWeight="bold">
          ⏳ 지난 이벤트
        </Typography>
        <Grid container spacing={3}>
          {renderEventCards(pastEvents)}
        </Grid>
      </Container>

      <LoginConfirmDialog
        open={askLogin}
        onClose={() => setAskLogin(false)}
        onConfirm={() => navigate('/login', { state: { from: '/calendar' } })}
      />
    </>
  );
};

export default SearchPlaces;
