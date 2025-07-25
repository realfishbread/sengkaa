import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Spacer from '../components/common/Spacer';
import { fetchPopularVenues } from '../pages/venue/find-cafes/VenueSearchApi';
import '../styles/App.css';
import {
  fetchPopularCafes,
  fetchPopularGames,
  fetchPopularYoutubers,
} from './birthday-cafe-register/api/EventSearchApi';

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: 0,
      top: '40%',
      zIndex: 2,
      background: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      '&:hover': { background: '#f0f0f0' },
    }}
  >
    <ArrowBackIos />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: 0,
      top: '40%',
      zIndex: 2,
      background: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      '&:hover': { background: '#f0f0f0' },
    }}
  >
    <ArrowForwardIos />
  </IconButton>
);

const SectionTitle = ({ title, category }) => {
  const navigate = useNavigate();

  const handleMoreClick = (category) => {
    if (category === 'venue') {
      navigate('/venue-search');
    } else {
      navigate('/search', { state: { category } });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 4,
        mt: 6,
        px: 2,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#000',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      <Box
        onClick={() => handleMoreClick(category)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          '&:hover': {
            '& .more-text': {
              color: '#000',
            },
            '& .arrow': {
              color: '#000',
            },
          },
        }}
      >
        <Typography
          className="more-text"
          sx={{
            fontSize: '0.875rem',
            color: '#666',
            transition: 'color 0.2s',
          }}
        >
          더보기
        </Typography>
        <Typography
          className="arrow"
          sx={{
            fontSize: '0.875rem',
            color: '#666',
            ml: 0.5,
            mt: '-1px',
            transition: 'color 0.2s',
          }}
        >
          ›
        </Typography>
      </Box>
    </Box>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const idolSliderRef = useRef(null);
  const streamerSliderRef = useRef(null);
  const gameSliderRef = useRef(null);
  const venueSliderRef = useRef(null);
  const [mainSlides, setMainSlides] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [popularCafes, setPopularCafes] = useState({
    idol: [],
    streamer: [],
    game: [],
  });
  const [reservableVenues, setReservableVenues] = useState([]);

  const fetchMainBanners = async () => {
    try {
      const res = await axios.get('https://eventcafe.site/user/main/banners/');
      // 응답 데이터 로깅
      console.log('API 응답 데이터:', res.data);

      // 중복 제거 전 데이터 길이
      console.log('중복 제거 전 개수:', res.data.results.length);

      // 이미지 URL 기준으로 중복 제거
      const uniqueBanners = Array.from(
        new Set(res.data.results.map((banner) => banner.image))
      ).map((image) =>
        res.data.results.find((banner) => banner.image === image)
      );

      // 중복 제거 후 데이터 길이
      console.log('중복 제거 후 개수:', uniqueBanners.length);
      console.log('최종 배너 데이터:', uniqueBanners);

      return uniqueBanners;
    } catch (error) {
      console.error('배너 데이터 가져오기 실패:', error);
      return [];
    }
  };

  useEffect(() => {
    const getSlides = async () => {
      const banners = await fetchMainBanners();
      setMainSlides(banners);
    };
    getSlides();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [idol, streamer, game] = await Promise.all([
          fetchPopularCafes(),
          fetchPopularYoutubers(),
          fetchPopularGames(),
        ]);
        const venues = await fetchPopularVenues();
        setPopularCafes({
          idol,
          streamer,
          game,
        });
        setReservableVenues(venues);
      } catch (err) {
        console.error('🔥 인기 데이터 불러오기 실패:', err);
      }
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: !isMobile,
    prevArrow: !isMobile ? <PrevArrow /> : null,
    nextArrow: !isMobile ? <NextArrow /> : null,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    variableWidth: true,
    slidesPerRow: 1,
    adaptiveHeight: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const adSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    variableWidth: false,
    adaptiveHeight: false,
    centerMode: false,
    fade: true,
  };

  return (
    <div className="Home">
      <main className="map-container">
        <div className="slider-wrapper">
          <Slider {...adSliderSettings}>
            {mainSlides.map((slide, index) => (
              <div
                key={slide.id || index}
                className="slide"
                onClick={() => slide.link && window.open(slide.link)}
                style={{ width: '100%' }}
              >
                <img
                  src={slide.image}
                  alt={slide.caption || ''}
                  style={{ width: '100%', display: 'block' }}
                  onLoad={(e) => {
                    console.log('배너 이미지 실제 크기:', {
                      width: e.target.naturalWidth,
                      height: e.target.naturalHeight,
                      ratio: (
                        e.target.naturalWidth / e.target.naturalHeight
                      ).toFixed(2),
                    });
                  }}
                />
                <br />
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                  {slide.caption}
                </Typography>
              </div>
            ))}
          </Slider>
        </div>
      </main>
      {/* 밑에 br 대신에 씁니다 */}
      <Spacer size={6} />
      <Box className="section">
        <br />

        <section className="popular-events">
          <SectionTitle title="🔥 인기 아이돌 카페" category="idol" />

          <div className="slider-wrapper" style={{ marginBottom: '2rem' }}>
            <Slider ref={idolSliderRef} {...sliderSettings}>
              {popularCafes.idol.map((cafe, index) => (
                <div key={index} className="cafe-slide">
                  <Box
                    sx={{
                      width: 200, // 고정 폭(슬라이드 간 간격 일정)
                      mx: 'auto',
                      marginTop: '1rem',
                      marginBottom: '2rem',
                      bgcolor: '#ffffff', // 회색 배경
                      borderRadius: 3,
                      p: 1.5, // 이미지와 배경 사이 여백
                      boxShadow: '0 6px 15px rgba(1,0,0,0.1)',
                      transition: 'transform .2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/birthday-cafes/${cafe.id}`)}
                  >
                    <Box className="cafe-card">
                      <img src={cafe.image} alt={cafe.cafe_name} />
                      <Box className="MuiBox-root">
                        <Typography
                          variant="subtitle2"
                          noWrap
                          textAlign="center"
                          sx={{ fontWeight: 500 }}
                        >
                          {cafe.group_name || cafe.cafe_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <br />

        <section className="popular-streamers">
          <SectionTitle title="🔥 인기 스트리머 콜라보" category="streamer" />
          <div className="slider-wrapper" style={{ marginBottom: '2rem' }}>
            <Slider ref={streamerSliderRef} {...sliderSettings}>
              {popularCafes.streamer.map((cafe, index) => (
                <div key={index} className="cafe-slide">
                  <Box
                    sx={{
                      width: 200, // 고정 폭(슬라이드 간 간격 일정)
                      mx: 'auto',
                      marginTop: '1rem',
                      marginBottom: '2rem',
                      bgcolor: '#ffffff', // 회색 배경
                      borderRadius: 3,
                      p: 1.5, // 이미지와 배경 사이 여백
                      boxShadow: '0 6px 15px rgba(1,0,0,0.1)',
                      transition: 'transform .2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/birthday-cafes/${cafe.id}`)}
                  >
                    <Box className="cafe-card">
                      <img src={cafe.image} alt={cafe.cafe_name} />
                      <Box className="MuiBox-root">
                        <Typography
                          variant="subtitle2"
                          noWrap
                          textAlign="center"
                          sx={{ mt: 1, fontWeight: 500 }}
                        >
                          {cafe.group_name || cafe.cafe_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <Spacer size={6} />

        <section className="popular-games">
          <SectionTitle title="🔥 인기 게임 콜라보" category="game" />
          <div className="slider-wrapper" style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                overflowX: 'hidden',
              }}
            >
              <Slider ref={gameSliderRef} {...sliderSettings}>
                {popularCafes.game.map((cafe, index) => (
                  <div key={index} className="cafe-slide">
                    <Box
                      sx={{
                        width: 230, // 고정 폭(슬라이드 간 간격 일정)
                        mx: 'auto',
                        marginTop: '1rem',
                        marginBottom: '2rem',
                        bgcolor: '#ffffff', // 회색 배경
                        borderRadius: 3,
                        p: 1.5, // 이미지와 배경 사이 여백
                        boxShadow: '0 6px 15px rgba(1,0,0,0.1)',
                        transition: 'transform .2s',
                        '&:hover': { transform: 'translateY(-4px)' },
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/birthday-cafes/${cafe.id}`)}
                    >
                      <Box className="cafe-card">
                        <img src={cafe.image} alt={cafe.cafe_name} />
                        <Box className="MuiBox-root">
                          <Typography
                            variant="subtitle2"
                            noWrap
                            textAlign="center"
                            sx={{ mt: 1, fontWeight: 500 }}
                          >
                            {cafe.group_name || cafe.cafe_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>

        <Spacer size={6} />

        <section className="reservable-venues">
          <SectionTitle title="대관 가능한 장소" category="venue" />
          <div className="slider-wrapper">
            <Slider ref={venueSliderRef} {...sliderSettings}>
              {reservableVenues.map((venue, index) => (
                <div key={index} className="cafe-slide">
                  <Box className="cafe-card">
                    <img src={venue.image} alt={venue.name} />
                    <Box>
                      <Typography variant="h6">{venue.name}</Typography>
                      <Typography variant="body2">
                        {venue.road_address}
                      </Typography>
                    </Box>
                  </Box>
                </div>
              ))}
            </Slider>
          </div>
        </section>
        <Spacer size={6} />
      </Box>
    </div>
  );
};

export default Home;
