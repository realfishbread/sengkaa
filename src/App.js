import React, { useState } from "react";
import Slider from "react-slick";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./App.css";


const CustomDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    transition: "transform 0.3s ease-in-out",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
}));

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
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
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  const slides = [
    { image: "/images/slide1.jpg", caption: "슬라이드 1" },
    { image: "/images/slide2.jpg", caption: "슬라이드 2" },
    { image: "/images/slide3.jpg", caption: "슬라이드 3" },
  ];

  const popularCafes = [
    { name: "사랑해린", description: "뉴진스 해린", image: "/images/cafe1.jpg" },
    { name: "카페 라떼", description: "부산 해운대의 아름다운 카페", image: "/images/cafe2.jpg" },
    { name: "카페 모카", description: "제주도의 멋진 전망 카페", image: "/images/cafe3.jpg" },
    { name: "카페 바닐라", description: "인천의 아늑한 카페", image: "/images/cafe4.jpg" },
    { name: "카페 에스프레소", description: "대구의 유명 카페", image: "/images/cafe5.jpg" },
  ];

  const rentableLocations = [
    { name: "카페 루프탑", description: "서울의 루프탑 대관 가능", image: "/images/location1.jpg" },
    { name: "카페 정원", description: "부산의 정원 카페 대관 가능", image: "/images/location2.jpg" },
    { name: "카페 바다", description: "제주의 바닷가 카페 대관 가능", image: "/images/location3.jpg" },
    { name: "카페 도시", description: "인천의 도심형 카페 대관 가능", image: "/images/location4.jpg" },
    { name: "카페 산", description: "강원도의 산속 카페 대관 가능", image: "/images/location5.jpg" },
  ];

  return (
    <div className="App" style={{ overflowY: "scroll", overflowX: "hidden", height: "100vh", scrollBehavior: "smooth" }}>
      {/* 헤더 */}
      <AppBar position="static" className="header">
        <Toolbar>
          {/* 드로어 버튼 */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          {/* 로고 */}
          <Typography variant="h6" className="header-title">
            EVENT CAFE
          </Typography>
          {/* 검색 필드 */}
          <div style={{ marginLeft: "auto", marginRight: "1rem" }}>
            <TextField
              variant="outlined"
              placeholder="찾으시는 최애가 있으신가요?"
              size="small"
              style={{ backgroundColor: "white", borderRadius: "4px" }}
              InputProps={{
                style: { fontSize: "0.8rem" },
              }}
            />
          </div>
          {/* 우측 로그인/회원가입 버튼 */}
          <div>
            <Button color="inherit">로그인</Button>
            <Button color="inherit">회원가입</Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* 드로어 메뉴 */}
      <CustomDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button>
            <ListItemText primary="홈" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="이벤트" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="카페 찾기" />
          </ListItem>
        </List>
      </CustomDrawer>

      {/* 광고 슬라이드 */}
      <main className="map-container">
        <Slider {...adSliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.image} alt={`Slide ${index + 1}`} />
              <p>{slide.caption}</p>
            </div>
          ))}
        </Slider>
      </main>

      {/* 인기 생일 카페 섹션 */}
      <section className="popular-cafes" style={{ padding: "2rem 1rem", marginTop: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", marginBottom: "1rem" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>인기 생일 카페</Typography>
          <Link href="#" style={{ fontSize: "0.9rem", textDecoration: "none", position: "absolute", right: 0 }}>더보기</Link>
        </div>
        <Slider {...cafeSliderSettings}>
          {popularCafes.map((cafe, index) => (
            <div key={index} className="cafe-slide" style={{ padding: "0 1rem" }}>
              <Box
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <img
                  src={cafe.image}
                  alt={cafe.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="h6" style={{ marginTop: "0.5rem" }}>
                  {cafe.name}
                </Typography>
                <Typography variant="body2" style={{ color: "#555" }}>
                  {cafe.description}
                </Typography>
              </Box>
            </div>
          ))}
        </Slider>
      </section>

      {/* 대관 가능한 장소 섹션 */}
      <section className="rentable-locations" style={{ padding: "2rem 1rem", marginTop: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", marginBottom: "1rem" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>대관 가능한 장소</Typography>
          <Link href="#" style={{ fontSize: "0.9rem", textDecoration: "none", position: "absolute", right: 0 }}>더보기</Link>
        </div>
        <Slider {...cafeSliderSettings}>
          {rentableLocations.map((location, index) => (
            <div key={index} className="location-slide" style={{ padding: "0 1rem" }}>
              <Box
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <img
                  src={location.image}
                  alt={location.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="h6" style={{ marginTop: "0.5rem" }}>
                  {location.name}
                </Typography>
                <Typography variant="body2" style={{ color: "#555" }}>
                  {location.description}
                </Typography>
              </Box>
            </div>
          ))}
        </Slider>
      </section>

      {/* 푸터 */}
      <footer className="footer" style={{ fontSize: "0.8rem", padding: "0.5rem" }}>
        <p>© EVENTCAFE, Inc | 고객문의 : eventcafe@gmail.com</p>
      </footer>
    </div>
  );
}

export default App;