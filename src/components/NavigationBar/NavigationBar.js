import { AppBar, Toolbar, Button, Box, TextField, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import Logo from "../common/Logo";

const NavigationBar = () => {
    const navigate = useNavigate();
    const [openEventMenu, setOpenEventMenu] = useState(false);

    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

        useEffect(() => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;
        
            fetch("https://eventcafe.site/user/profile/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            .then(res => {
                if (!res.ok) throw new Error("인증 실패");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => {
                console.error("유저 정보 오류", err);
                setUser(null);
            });
        }, []);
        

    return (
        <>
            {/* ✅ 상단 네비게이션 바 */}
            <AppBar position="static" className="navbar">
                <Toolbar>
                    <Logo />
                    <TextField
                        variant="outlined"
                        placeholder="찾으시는 최애가 있으신가요?"
                        size="small"
                        className="search-bar"
                    />
                    {user ? (
                <>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar
                        src={user.profile_image || ""}
                        alt={user.username}
                        >
                        {user.username?.[0]}
                        </Avatar>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => navigate("/profile")}>내 프로필</MenuItem>
                    <MenuItem
                        onClick={() => {
                            setAnchorEl(null);      // 메뉴 닫기
                            localStorage.removeItem("accessToken");
                            setUser(null);
                            navigate("/");
                        }}
                        >
                        로그아웃
                        </MenuItem>
                    </Menu>
                </>
                ) : (
  <>
    <Button color="inherit" className="auth-button" onClick={() => navigate("/login")}>로그인</Button>
    <Button color="inherit" className="auth-button" onClick={() => navigate("/signup")}>회원가입</Button>
  </>
)}
                </Toolbar>
            </AppBar>

            {/* ✅ 하단 네비게이션 바 */}
            <Box
                className={`bottom-nav ${openEventMenu ? "expanded" : ""}`}
                onMouseEnter={() => setOpenEventMenu(true)}
                onMouseLeave={() => setOpenEventMenu(false)}
            >
                {/* ✅ 메뉴 아이템: 이벤트 */}
                <Box className="nav-item-wrapper">
                    <Button className="nav-item">이벤트</Button>
                    <Box className="submenu">
                        <Button onClick={() => navigate("/register")} className="submenu-item">이벤트 등록</Button>
                        <Button onClick={() => navigate("/search")} className="submenu-item">이벤트 찾기</Button>
                    </Box>
                </Box>

                {/* ✅ 메뉴 아이템: 장소 대관 */}
                <Box className="nav-item-wrapper">
                    <Button className="nav-item">장소 대관</Button>
                    <Box className="submenu">
                        <Button onClick={() => navigate("/venue")} className="submenu-item">장소 등록</Button>
                        <Button onClick={() => navigate("/venue-search")} className="submenu-item">대관 찾기</Button>
                    </Box>
                </Box>

                {/* ✅ 메뉴 아이템: 콜라보 소식 */}
                <Box className="nav-item-wrapper">
                    <Button className="nav-item" onClick={() => navigate("/collab")}>콜라보 소식</Button>
                </Box>

                {/* ✅ 메뉴 아이템: 주변 카페 지도 */}
                <Box className="nav-item-wrapper">
                    <Button className="nav-item" onClick={() => navigate("/map")}>주변 카페</Button>
                </Box>

                {/* ✅ 메뉴 아이템: 즐겨찾기 */}
                <Box className="nav-item-wrapper">
                    <Button className="nav-item" onClick={() => navigate("/subscribe")}>즐겨찾기</Button>
                </Box>

                {/* ✅ 메뉴 아이템: 게시판 */}
                <Box className="nav-item-wrapper">
                    <Button className="nav-item" onClick={() => navigate("/board")}>게시판</Button>
                </Box>
            </Box>
        </>
    );
};

export default NavigationBar;
