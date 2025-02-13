import React, { useState } from "react";
import Slider from "react-slick";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Link,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import BirthdayCafeRegister from "./pages/BirthdayCafeRegister";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavigationBar from "./component/NavigationBar"; // ✅ 네비게이션 추가

function App() {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const navigate = useNavigate();

  const handleNavItemClick = (index, path) => {
    setActiveNavItem(index);
    navigate(path);
  };

  const theme = createTheme({
    typography: {
      fontFamily: `"Pretendard Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important`,
    },
  });

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
    infinite: false,
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
    { image: "/images/slide1.jpg", caption: "슬라이드 1" },
    { image: "/images/slide2.jpg", caption: "슬라이드 2" },
    { image: "/images/slide3.jpg", caption: "슬라이드 3" },
  ];

  const popularCafes = [
    { name: "카페 1", description: "뉴진스 해린", image: "/images/cafe1.jpg" },
    { name: "카페 2", description: "트리플에스 나경", image: "/images/cafe2.jpg" },
    { name: "카페 3", description: "제주도의 멋진 전망 카페", image: "/images/cafe3.jpg" },
    { name: "카페 4", description: "인천의 아늑한 카페", image: "/images/cafe4.jpg" },
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
    <ThemeProvider theme={theme}>
    <div className="App" style={{ overflowY: "scroll", overflowX: "hidden", height: "100vh", scrollBehavior: "smooth" }}>
      <AppBar position="static" className="header" style={{ minHeight: "60px", backgroundColor: "#b3dff0", transition: "background-color 0.3s ease-in-out" }}>
        <Toolbar style={{ minHeight: "50px", paddingLeft: "8px", paddingRight: "8px" }}>
          <img src="/images/logo.png" alt="Event Cafe Logo" style={{ height: "50px", marginLeft: "0.3rem" }} />
          <div style={{ marginLeft: "auto", marginRight: "1rem" }}>
            <TextField variant="outlined" placeholder="찾으시는 최애가 있으신가요?" size="small"
              style={{ backgroundColor: "white", borderRadius: "4px", fontSize: "0.8rem" }}
              InputProps={{ style: { fontSize: "0.8rem" } }} />
          </div>
          <div>
            <Button style={{ color: "#000000", fontSize: "0.8rem", padding: "4px 8px", minWidth: "60px" }} onClick={() => navigate("/login")}>
              로그인
            </Button>
            <Button style={{ color: "#000000", fontSize: "0.8rem", padding: "4px 8px", minWidth: "60px" }} onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Box style={{ backgroundColor: "#DCF2FF", padding: "10px 0", borderBottom: "1px solid #c7c7c7", display: "flex", justifyContent: "flex-start", paddingLeft: "70px" }}>
        {navItems.map((item, index) => (
          <Button key={index} onClick={() => handleNavItemClick(index, item.path)}
            onMouseEnter={() => setActiveNavItem(index)} onMouseLeave={() => setActiveNavItem(null)}
            style={{ margin: "0 15px", color: activeNavItem === index ? "#0056b3" : "#000000", fontSize: activeNavItem === index ? "1.1rem" : "1rem",
            textDecoration: "none", fontWeight: activeNavItem === index ? "bold" : "normal",
            transition: "color 0.3s ease, font-size 0.3s ease", cursor: "pointer", background: "none", border: "none", outline: "none" }}>
            {item.name}
          </Button>
        ))}
      </Box>

      <main className="map-container">
        <Slider {...adSliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.image} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "auto" }} />
              <p>{slide.caption}</p>
            </div>
          ))}
        </Slider>
      </main>

      <section className="popular-cafes" style={{ padding: "2rem 1rem", marginTop: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", marginBottom: "1rem" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>인기 생일 카페</Typography>
          <Link href="#" style={{ fontSize: "0.9rem", textDecoration: "none", position: "absolute", right: 0 }}>더보기</Link>
        </div>
        <Slider {...cafeSliderSettings}>
          {popularCafes.map((cafe, index) => (
            <div key={index} className="cafe-slide" style={{ padding: "0 1rem" }}>
              <Box style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", textAlign: "center", width: "100%", maxWidth: "300px", margin: "auto" }}>
                <img src={cafe.image} alt={cafe.name} style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }} />
                <Typography variant="h6" style={{ marginTop: "0.5rem" }}>{cafe.name}</Typography>
                <Typography variant="body2" style={{ color: "#555" }}>{cafe.description}</Typography>
              </Box>
            </div>
          ))}
        </Slider>
      </section>

      <footer className="footer" style={{ fontSize: "0.8rem", padding: "0.5rem" }}>
        <p>© EVENTCAFE, Inc | 고객문의 : eventcafe@gmail.com</p>
      </footer>
    </div>
    </ThemeProvider>
  );
}

export default App;
