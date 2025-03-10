import { AppBar, Toolbar, Button, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState(null);
    const [openEventMenu, setOpenEventMenu] = useState(false);

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
                
                
                 {/* ✅ 네비게이션 바 (바 전체가 자연스럽게 확장됨) */}
               {/* ✅ 네비게이션 바 (바가 확장되면서 서브메뉴가 자연스럽게 나옴) */}
               <Box 
                className={`bottom-nav ${openEventMenu ? "expanded" : ""}`} 
                onMouseEnter={() => setOpenEventMenu(true)}
                onMouseLeave={() => setOpenEventMenu(false)}
            >
                <Button className="nav-item">이벤트</Button>

                {/* ✅ 서브 메뉴가 세로로 자연스럽게 확장됨 */}
                <Box className="submenu">
                    <Button onClick={() => navigate("/register")} className="submenu-item">이벤트 등록</Button>
                    <Button onClick={() => navigate("/search")} className="submenu-item">이벤트 찾기</Button>
                </Box>

                <Button className="nav-item" onClick={() => navigate("/venue")}>장소 대관</Button>
                <Button className="nav-item" onClick={() => navigate("/collab")}>콜라보 소식</Button>
                <Button className="nav-item" onClick={() => navigate("/map")}>주변 카페 지도</Button>
            </Box>
        </>
    );
};

export default NavigationBar;
