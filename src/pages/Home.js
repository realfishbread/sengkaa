import { Box, Typography, IconButton } from '@mui/material';
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../styles/App.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

  const popularCafes = [
    { name: '카페 1', description: '뉴진스 해린', image: process.env.PUBLIC_URL + '/images/cafe1.jpg' },
    { name: '카페 2', description: '트리플에스 나경', image: process.env.PUBLIC_URL + '/images/cafe2.jpg' },
    { name: '카페 3', description: '리락쿠마 x 팝퍼블', image: process.env.PUBLIC_URL + '/images/rirakuma.jpg' },
    { name: '카페 4', description: '캐릭캐릭 체인지 x 팝퍼블 용산', image: process.env.PUBLIC_URL + '/images/chacha.jpg' },
    { name: '카페 5', description: '대구의 유명 카페', image: process.env.PUBLIC_URL + '/images/cafe5.jpg' },
  ];

  const reservableVenues = [
    { name: '대관 장소 1', description: '서울 강남', image: '/media/venue_images/venue1.jpg' },
    { name: '대관 장소 2', description: '대구 수성구', image: '/media/venue_images/venue2.jpg' }
  ];

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
                  <img src={cafe.image} alt={cafe.name} style={{ width: '100%', height: 'auto' }} />
                  <Box p={2} textAlign="center">
                    <Typography variant="h6">{cafe.name}</Typography>
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
                  <Typography variant="body2">{venue.description}</Typography>
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
