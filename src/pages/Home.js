import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../styles/App.css'; // CSS 파일 임포트 유지
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

  // sliderSettings 함수 수정: slidesToShow 기본값을 4로 설정
  // 반응형 설정은 유지하되, 전체 화면에서 4개 보여주도록
  const sliderSettings = (slidesToShow = 4) => ({
    dots: false,
    infinite: false, // 겹침 문제가 발생하면 infinite를 false로 두는 것이 디버깅에 유리
    speed: 500,
    slidesToShow: slidesToShow, // 기본값 또는 전달된 값 사용
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

  const goPrevPopular = useCallback(
    () => popularSliderRef.current?.slickPrev(),
    []
  );
  const goNextPopular = useCallback(
    () => popularSliderRef.current?.slickNext(),
    []
  );

  const goPrevVenue = useCallback(
    () => venueSliderRef.current?.slickPrev(),
    []
  );
  const goNextVenue = useCallback(
    () => venueSliderRef.current?.slickNext(),
    []
  );

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
          {/* ⭐ slidesToShow를 4로 명시적으로 지정 (혹은 sliderSettings 기본값 사용) */}
          <Slider ref={popularSliderRef} {...sliderSettings(4)}>
            {popularCafes.map((cafe, index) => (
              <div
                key={index}
                className="cafe-slide"
                // ⭐ 이 인라인 스타일을 제거합니다. CSS 파일의 .slick-slide가 처리
                // style={{ padding: '0 10px' }}
              >
                <Box
                  className="cafe-card"
                  // MUI Box 컴포넌트의 style은 인라인 스타일로 적용되므로,
                  // CSS 파일에서 .cafe-card 스타일을 정의하고 여기서는 필요한 override만 남깁니다.
                  // 현재 설정은 문제가 없으나, App.css에 정의된 내용을 고려하세요.
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={cafe.image}
                    alt={cafe.cafe_name}
                    // 이미지 스타일도 App.css로 옮기는 것을 권장합니다.
                    style={{ width: '100%', height: 'auto' }}
                  />
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
          <IconButton
            onClick={goPrevPopular}
            className="slider-arrow left-arrow"
            style={{
              position: 'absolute',
              top: '50%',
              left: '-40px',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={goNextPopular}
            className="slider-arrow right-arrow"
            style={{
              position: 'absolute',
              top: '50%',
              right: '-40px',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </section>

      <section className="reservable-venues">
        <Typography variant="h5" textAlign="center" gutterBottom>
          대관 가능한 장소
        </Typography>
        <div className="slider-wrapper" style={{ position: 'relative' }}>
          {/* ⭐ slidesToShow를 4로 명시적으로 지정 (혹은 sliderSettings 기본값 사용) */}
          <Slider ref={venueSliderRef} {...sliderSettings(4)}>
            {reservableVenues.map((venue, index) => (
              <div key={index} className="cafe-slide">
                <Box className="cafe-card"> {/* cafe-card 클래스 사용 */}
                  <img src={venue.image} alt={venue.name} />
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography variant="body2">{venue.road_address}</Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goPrevVenue}
            className="slider-arrow left-arrow"
            style={{
              position: 'absolute',
              top: '50%',
              left: '-40px',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={goNextVenue}
            className="slider-arrow right-arrow"
            style={{
              position: 'absolute',
              top: '50%',
              right: '-40px',
              transform: 'translateY(-50%)',
            }}
        >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </section>
    </div>
  );
};

export default Home;