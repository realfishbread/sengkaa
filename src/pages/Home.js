import { Box, Typography, Tabs, Tab } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../styles/App.css';
import { fetchPopularCafes, fetchPopularGames, fetchPopularYoutubers } from './birthday-cafe-register/api/EventSearchApi';
import { fetchPopularVenues } from '../pages/venue/find-cafes/VenueSearchApi';

const Home = () => {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('idol');
  const navigate = useNavigate();

  const idolSliderRef = useRef(null);
  const streamerSliderRef = useRef(null);
  const gameSliderRef = useRef(null);
  const venueSliderRef = useRef(null);

  const handleNavItemClick = (index, path) => {
    setActiveNavItem(index);
    navigate(path);
  };

  const sliderSettings = (slidesToShow = 4) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    swipe: false,
    draggable: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
    touchThreshold: 1,
    swipeToSlide: false,
    useCSS: true,
    useTransform: true
  });

  const adSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const slides = [
    { image: '/images/genshin.jpeg', caption: '원신 x 메가커피 콜라보' },
    { image: '/images/honkai.png', caption: '붕괴 콜라보' },
    { image: '/images/xx.jpg', caption: '흑집사 x 애니메이트 카페 콜라보' },
  ];

  const [popularCafes, setPopularCafes] = useState({
    idol: [],
    streamer: [],
    game: []
  });
  const [reservableVenues, setReservableVenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [idol, streamer, game] = await Promise.all([
        fetchPopularCafes(),          // idol
        fetchPopularYoutubers(),      // youtuber -> streamer로 이름 바꿔서 사용 가능
        fetchPopularGames(),          // game
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

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  const handleMoreClick = (category) => {
    if (category === 'venue') {
      navigate('/venue-search');
    } else {
      navigate('/search', { state: { category } });
    }
  };

  const SectionTitle = ({ title, category }) => (
    <Box 
      sx={{ 
        position: 'relative',
        mb: 4,
        mt: 6,
        px: 2,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#000',
          textAlign: 'center'
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
              color: '#000'
            },
            '& .arrow': {
              color: '#000'
            }
          }
        }}
      >
        <Typography 
          className="more-text"
          sx={{ 
            fontSize: '0.875rem',
            color: '#666',
            transition: 'color 0.2s'
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
            transition: 'color 0.2s'
          }}
        >
          ›
        </Typography>
      </Box>
    </Box>
  );

  // 각 슬라이더에 대한 마우스 드래그 이벤트 설정 함수
  const setupSliderDrag = (sliderRef) => {
    const sliderNode = sliderRef.current?.innerSlider?.list;
    if (!sliderNode) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      sliderNode.style.cursor = 'grabbing';
      startX = e.pageX - sliderNode.offsetLeft;
      scrollLeft = sliderNode.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      sliderNode.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      sliderNode.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderNode.offsetLeft;
      const walk = (x - startX) * 2;
      sliderNode.scrollLeft = scrollLeft - walk;
    };

    sliderNode.style.cursor = 'grab';
    sliderNode.addEventListener('mousedown', handleMouseDown);
    sliderNode.addEventListener('mouseleave', handleMouseLeave);
    sliderNode.addEventListener('mouseup', handleMouseUp);
    sliderNode.addEventListener('mousemove', handleMouseMove);

    return () => {
      sliderNode.removeEventListener('mousedown', handleMouseDown);
      sliderNode.removeEventListener('mouseleave', handleMouseLeave);
      sliderNode.removeEventListener('mouseup', handleMouseUp);
      sliderNode.removeEventListener('mousemove', handleMouseMove);
    };
  };

  useEffect(() => {
    setupSliderDrag(idolSliderRef);
    setupSliderDrag(streamerSliderRef);
    setupSliderDrag(gameSliderRef);
    setupSliderDrag(venueSliderRef);
  }, []);

  return (
    <div className="Home">
      <main className="map-container">
        <div className="slider-wrapper">
          <Slider {...adSliderSettings}>
            {slides.map((slide, index) => (
              <div key={index} className="slide">
                <img src={slide.image} alt={slide.caption} />
                <p>{slide.caption}</p>
              </div>
            ))}
          </Slider>
        </div>
      </main>

      <section className="popular-events">
        <SectionTitle title="인기 아이돌 카페" category="idol" />
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={idolSliderRef} {...sliderSettings(4)}>
            {popularCafes.idol.map((cafe, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card">
                  <img src={cafe.image} alt={cafe.cafe_name} />
                  <Box p={2} textAlign="center">
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {cafe.group_name || cafe.cafe_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {cafe.event_name || cafe.description}
                    </Typography>
                  </Box>
                </Box>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="popular-events">
        <SectionTitle title="인기 스트리머 카페" category="streamer" />
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={streamerSliderRef} {...sliderSettings(4)}>
            {popularCafes.streamer.map((cafe, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card">
                  <img src={cafe.image} alt={cafe.cafe_name} />
                  <Box p={2} textAlign="center">
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {cafe.group_name || cafe.cafe_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {cafe.event_name || cafe.description}
                    </Typography>
                  </Box>
                </Box>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="popular-events">
        <SectionTitle title="인기 게임 콜라보" category="game" />
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={gameSliderRef} {...sliderSettings(4)}>
            {popularCafes.game.map((cafe, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card">
                  <img src={cafe.image} alt={cafe.cafe_name} />
                  <Box p={2} textAlign="center">
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {cafe.group_name || cafe.cafe_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {cafe.event_name || cafe.description}
                    </Typography>
                  </Box>
                </Box>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="reservable-venues">
        <SectionTitle title="대관 가능한 장소" category="venue" />
        <div className="slider-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
          <Slider ref={venueSliderRef} {...sliderSettings(4)}>
            {reservableVenues.map((venue, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card">
                  <img src={venue.image} alt={venue.name} />
                  <Box p={2} textAlign="center">
                    <Typography variant="h6">{venue.name}</Typography>
                    <Typography variant="body2">{venue.road_address}</Typography>
                  </Box>
                </Box>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default Home;
