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

  // ref는 초기값 null로 선언
  const popularSliderRef = useRef(null);
  const venueSliderRef = useRef(null);

  const handleNavItemClick = (index, path) => {
    setActiveNavItem(index);
    navigate(path);
  };

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

  const cafeSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const reservableVenuesSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const slides = [
    { image: process.env.PUBLIC_URL + '/images/genshin.jpeg', caption: '원신 x 메가커피 콜라보' },
    { image: process.env.PUBLIC_URL + '/images/honkai.png', caption: '붕괴 콜라보' },
    { image: process.env.PUBLIC_URL + '/images/xx.jpg', caption: '흑집사 x 애니메이트 카페 콜라보' },
  ];

  const popularCafes = [
    { name: '카페 1', description: '뉴진스 해린', image: process.env.PUBLIC_URL + '/images/cafe1.jpg' },
    { name: '카페 2', description: '트리플에스 나경', image: process.env.PUBLIC_URL + '/images/cafe2.jpg' },
    { name: '카페 3', description: '리락쿠마 x 팝퍼블', image: process.env.PUBLIC_URL + '/images/rirakuma.jpg' },
    { name: '카페 4', description: '캐릭캐릭 체인지 x 팝퍼블 용산', image: process.env.PUBLIC_URL + '/images/chacha.jpg' },
    { name: '카페 5', description: '대구의 유명 카페', image: process.env.PUBLIC_URL + '/images/cafe5.jpg' },
  ];

  const reservableVenues = [
    { name: '카페 1', description: '대관 가능한 카페', image: process.env.PUBLIC_URL + '/media/venue_images/venue1.jpg' },
    { name: '카페 2', description: '대관 가능한 카페', image: process.env.PUBLIC_URL + '/media/venue_images/venue2.jpg' },
  ];

  const goPrevPopular = useCallback(() => {
    if (popularSliderRef.current) popularSliderRef.current.slickPrev();
  }, []);

  const goNextPopular = useCallback(() => {
    if (popularSliderRef.current) popularSliderRef.current.slickNext();
  }, []);

  const goPrevVenue = useCallback(() => {
    if (venueSliderRef.current) venueSliderRef.current.slickPrev();
  }, []);

  const goNextVenue = useCallback(() => {
    if (venueSliderRef.current) venueSliderRef.current.slickNext();
  }, []);

  return (
    <div className="Home">
      {/* 배너 슬라이드 */}
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

      {/* 인기 카페 이벤트 */}
      <section className="popular-cafes">
        <Typography variant="h5" textAlign="center" gutterBottom>
          인기 카페 이벤트
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={popularSliderRef} {...cafeSliderSettings}>
            {popularCafes.map((cafe, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card">
                  <img src={cafe.image} alt={cafe.name} />
                  <Typography variant="h6">{cafe.name}</Typography>
                  <Typography variant="body2">{cafe.description}</Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goPrevPopular}
            className="slider-arrow left-arrow"
            size="small"
            aria-label="Previous popular cafe"
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={goNextPopular}
            className="slider-arrow right-arrow"
            size="small"
            aria-label="Next popular cafe"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </section>

      {/* 대관 가능한 장소 */}
      <section className="reservable-venues">
        <Typography variant="h5" textAlign="center" gutterBottom>
          대관 가능한 장소
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={venueSliderRef} {...reservableVenuesSettings}>
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
          <IconButton
            onClick={goPrevVenue}
            className="slider-arrow left-arrow"
            size="small"
            aria-label="Previous reservable venue"
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={goNextVenue}
            className="slider-arrow right-arrow"
            size="small"
            aria-label="Next reservable venue"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </section>
    </div>
  );
};

export default Home;
