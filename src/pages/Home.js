import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../styles/App.css';
import { fetchPopularCafes } from './birthday-cafe-register/api/EventSearchApi';
import { fetchPopularVenues } from './venue/find-cafes/api/VenueSearchApi';
const Home = () => {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const navigate = useNavigate();

  

  const popularSliderRef = useRef(null);
  const venueSliderRef = useRef(null);

  const handleNavItemClick = (index, path) => {
    setActiveNavItem(index);
    navigate(path);
  };

  const sliderSettings = (slidesToShow) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
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

  const [popularCafes, setPopularCafes] = useState([]);
  const [reservableVenues, setReservableVenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cafes = await fetchPopularCafes();
        const venues = await fetchPopularVenues();
        setPopularCafes(cafes);
        setReservableVenues(venues);
      } catch (err) {
        console.error('🔥 인기 데이터 불러오기 실패:', err);
      }
    };
    fetchData();
  }, []);

  const goPrevPopular = useCallback(() => popularSliderRef.current?.slickPrev(), []);
  const goNextPopular = useCallback(() => popularSliderRef.current?.slickNext(), []);

  const goPrevVenue = useCallback(() => venueSliderRef.current?.slickPrev(), []);
  const goNextVenue = useCallback(() => venueSliderRef.current?.slickNext(), []);

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

      <section className="popular-cafes">
        <Typography variant="h5" textAlign="center" gutterBottom>
          인기 카페 이벤트
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={popularSliderRef} {...sliderSettings(3)}>
            {popularCafes.map((cafe, index) => (
              <div key={index} className="cafe-slide" style={{ padding: '0 10px' }}>
                <Box className="cafe-card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src={cafe.image} alt={cafe.cafe_name} style={{ width: '100%', height: 'auto' }} />
                  <Box p={2} textAlign="center">
                    <Typography variant="h6">{cafe.cafe_name}</Typography>
                    <Typography variant="body2">{cafe.description}</Typography>
                  </Box>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton onClick={goPrevPopular} className="slider-arrow left-arrow" style={{ position: 'absolute', top: '50%', left: '-40px', transform: 'translateY(-50%)' }}><ArrowBackIosIcon /></IconButton>
          <IconButton onClick={goNextPopular} className="slider-arrow right-arrow" style={{ position: 'absolute', top: '50%', right: '-40px', transform: 'translateY(-50%)' }}><ArrowForwardIosIcon /></IconButton>
        </div>
      </section>

      <section className="reservable-venues">
        <Typography variant="h5" textAlign="center" gutterBottom>
          대관 가능한 장소
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={venueSliderRef} {...sliderSettings(3)}>
            {reservableVenues.map((venue, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card">
                  <img src={venue.image} alt={venue.name} />
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography variant="body2">{venue.road_address}</Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton onClick={goPrevVenue} className="slider-arrow left-arrow" style={{ position: 'absolute', top: '50%', left: '-40px', transform: 'translateY(-50%)' }}><ArrowBackIosIcon /></IconButton>
          <IconButton onClick={goNextVenue} className="slider-arrow right-arrow" style={{ position: 'absolute', top: '50%', right: '-40px', transform: 'translateY(-50%)' }}><ArrowForwardIosIcon /></IconButton>
        </div>
      </section>
    </div>
  );
};

export default Home;
