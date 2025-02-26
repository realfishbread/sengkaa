import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, TextField, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const slides = [
    { image: "/images/genshin.jpeg", caption: "원신 x 메가커피 콜라보" },
    { image: "/images/honkai.png", caption: "붕괴 콜라보" },
    { image: "/images/xx.jpg", caption: "흑집사 x 애니메이트 카페 콜라보" },
  ];

  const popularCafes = [
    { name: "카페 1", description: "뉴진스 해린", image: "/images/cafe1.jpg" },
    { name: "카페 2", description: "트리플에스 나경", image: "/images/cafe2.jpg" },
    { name: "카페 3", description: "리락쿠마 x 팝퍼블", image: "/images/rirakuma.jpg" },
    { name: "카페 4", description: "캐릭캐릭 체인지 x 팝퍼블 용산", image: "/images/chacha.jpg" },
    { name: "카페 5", description: "대구의 유명 카페", image: "/images/cafe5.jpg" },
  ];

  const navItems = [
    { name: "생일카페 등록", path: "/register" },
    { name: "카페 찾기", path: "/search" },
    { name: "장소 대관", path: "/venue" },
    { name: "콜라보 소식", path: "/collab" },
    { name: "주변 카페 지도", path: "/map" }
  ];

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
            <Typography variant="h5">인기 생일 카페</Typography>
            <Slider {...cafeSliderSettings}>
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
        </section>
        
        
    </div>
);
}

export default Home;
