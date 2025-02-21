import { AppBar, Toolbar, Button, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState(null);

    const navItems =[
      { name: "생일카페 등록", path: "/register"},
      { name: "카페 찾기", path: "/search" },
        { name: "장소 대관", path: "/venue" },
        { name: "콜라보 소식", path: "/collab" },
        { name: "주변 카페 지도", path: "/map" }
    ];
    return (
      <>
          {/* ✅ 상단 네비게이션 바 */}
      <AppBar position="static" style={{ backgroundColor: "#DCF2FF" }}>
        <Toolbar>
          <img src="/images/logo.png" alt="Event Cafe Logo" style={{ height: "53px" }} />
          <TextField variant="outlined" placeholder="찾으시는 최애가 있으신가요?" size="small" style={{ marginLeft: "auto", backgroundColor:"white" }} />
          <Button color="inherit" sx={{color: "#000000"}} onClick={() => navigate("/login")}>로그인</Button>
          <Button color="inherit"  sx={{color: "#000000"}} onClick={() => navigate("/signup")}>회원가입</Button>
        </Toolbar>
      </AppBar>

          {/* ✅ 하단 메뉴 추가 */}
          <Box className="bottom-nav">
              {navItems.map((item, index) => (
                  <Button
                      key={index}
                      onClick={() => navigate(item.path)}
                      onMouseEnter={() => setActiveNavItem(index)}
                      onMouseLeave={() => setActiveNavItem(null)}
                      className={`nav-item ${activeNavItem === index ? "active" : ""}`}
                  >
                      {item.name}
                  </Button>
              ))}
          </Box>
      </>
  );
};

export default NavigationBar;
