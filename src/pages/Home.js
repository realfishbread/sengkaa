import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../styles/App.css';

const Home = () => {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const navigate = useNavigate();

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
  };

  const cafeSliderSettings = {
    dots: false,
    infinite: false, // 끝까지 스크롤 가능하도록 infinite를 false로 설정
    speed: 500,
    slidesToShow: 3, // 초기 보여지는 슬라이드 수 (반응형 설정은 유지)
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const slides = [
    { image: '/images/genshin.jpeg', caption: '원신 x 메가커피 콜라보' },
    { image: '/images/honkai.png', caption: '붕괴 콜라보' },
    { image: '/images/xx.jpg', caption: '흑집사 x 애니메이트 카페 콜라보' },
  ];

  const popularCafes = [
    { name: '카페 1', description: '뉴진스 해린', image: '/images/cafe1.jpg' },
    {
      name: '카페 2',
      description: '트리플에스 나경',
      image: '/images/cafe2.jpg',
    },
    {
      name: '카페 3',
      description: '리락쿠마 x 팝퍼블',
      image: '/images/rirakuma.jpg',
    },
    {
      name: '카페 4',
      description: '캐릭캐릭 체인지 x 팝퍼블 용산',
      image: '/images/chacha.jpg',
    },
    {
      name: '카페 5',
      description: '대구의 유명 카페',
      image: '/images/cafe5.jpg',
    },
  ];

  const reservableVenues = [
    {
      name: '카페 1',
      description: '대관 가능한 카페',
      image: '/media/venue_images/venue1.jpg', // 사진 안 보임 확인 필요
    },
    {
      name: '카페 2',
      description: '대관 가능한 카페',
      image: '/media/venue_images/venue2.jpg',
    },
  ];

  const navItems = [
    { name: '생일카페 등록', path: '/register' },
    { name: '카페 찾기', path: '/search' },
    { name: '장소 대관', path: '/venue' },
    { name: '콜라보 소식', path: '/collab' },
    { name: '주변 카페 지도', path: '/map' },
  ];

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
        <Typography variant="h5">인기 카페 이벤트</Typography>
        <div className="slick-slider">
          {popularCafes.map((cafe, index) => (
            <div key={index} className="cafe-slide">
              <Box className="cafe-card">
                <img src={cafe.image} alt={cafe.name} />
                <Typography variant="h6">{cafe.name}</Typography>
                <Typography variant="body2">{cafe.description}</Typography>
              </Box>
            </div>
          ))}
        </div>
      </section>

      {/* 대관 가능한 장소 */}
      <section className="reservable-venues">
        <Typography variant="h5">대관 가능한 카페</Typography>
        <div className="slick-slider">
          {reservableVenues.map((venue, index) => (
            <div key={index} className="cafe-slide">
              <Box className="cafe-card">
                <img src={venue.image} alt={venue.name} />
                <Typography variant="h6">{venue.name}</Typography>
                <Typography variant="body2">{venue.description}</Typography>
              </Box>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
