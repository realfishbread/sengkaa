import { AppBar, Toolbar, Button, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState(null);

    const navItems =[
      { name: "이벤트 등록", path: "/register"},
      { name: "카페 찾기", path: "/search" },
        { name: "장소 대관", path: "/venue" },
        { name: "콜라보 소식", path: "/collab" },
        { name: "주변 카페 지도", path: "/map" }
    ];
    return (
      <>
          {/* ✅ 상단 네비게이션 바 */}
      <AppBar position="static" className="navbar">
        <Toolbar>
        <img src="/images/logo.png"
             alt="Event Cafe Logo"
            className="logo" // ✅ 클릭 가능한 포인터 스타일 적용
            onClick={() => navigate("/")} />
          <TextField variant="outlined" placeholder="찾으시는 최애가 있으신가요?" size="small" className="search-bar" />
          <Button color="inherit" className="auth-button" onClick={() => navigate("/login")}>로그인</Button>
          <Button color="inherit"  className="auth-button" onClick={() => navigate("/signup")}>회원가입</Button>
        </Toolbar>
      </AppBar>

                      {/* ✅ 기본 메뉴 (항상 표시됨) */}
                <Box className="bottom-nav">
                <Button className="nav-item" onClick={() => navigate("/register")}>이벤트 등록</Button>
                <Button className="nav-item" onClick={() => navigate("/search")}>카페 찾기</Button>
                <Button className="nav-item" onClick={() => navigate("/venue")}>장소 대관</Button>
                <Button className="nav-item" onClick={() => navigate("/collab")}>카페 찾기</Button>
                <Button className="nav-item" onClick={() => navigate("/map")}>주변 카페 지도</Button>
                
                
                {/* ✅ 마우스를 올리면 내려오는 추가 메뉴 */}
                <Box className="menu-items">
                    {navItems.map((item, index) => (
                        <Button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="nav-item"
                        >
                            {item.name}
                        </Button>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default NavigationBar;
