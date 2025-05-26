import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../styles/App.css';
import { fetchPopularCafes } from './birthday-cafe-register/api/EventSearchApi';
import { fetchPopularVenues } from '../pages/venue/find-cafes/VenueSearchApi';

const Home = () => {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const navigate = useNavigate();

  const popularSliderRef = useRef(null);
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
    swipe: true,
    draggable: true,
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

  // 대관 가능한 장소 슬라이더에 마우스 휠 이벤트 적용
  useEffect(() => {
    const sliderNode = venueSliderRef.current?.innerSlider?.list;
    if (!sliderNode) return;

    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        venueSliderRef.current.slickPrev();
      } else {
        venueSliderRef.current.slickNext();
      }
    };

    sliderNode.addEventListener('wheel', onWheel);

    return () => {
      sliderNode.removeEventListener('wheel', onWheel);
    };
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
        <Typography variant="h5" textAlign="center" gutterBottom>
          현재 인기 이벤트
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Slider ref={popularSliderRef} {...sliderSettings(4)}>
            {popularCafes.map((cafe, index) => (
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
        <Typography variant="h5" textAlign="center" gutterBottom>
          대관 가능한 장소
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
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
