import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';
import Logo from '../common/Logo';
import './NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [openEventMenu, setOpenEventMenu] = useState(false);

  const { user, setUser } = useContext(UserContext); // 전역 상태
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // token 은 axios 인터셉터가 자동으로 붙여 줍니다
    axiosInstance
      .get('/user/profile/')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []); // ← NavigationBar 가 리마운트될 때마다 한 번만

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
                <Avatar src={user.profile_image || ''} alt={user.username}>
                  {user.username?.[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => navigate(`/user/profile/${user.username}/`)}
                >
                  내 프로필
                </MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>설정</MenuItem>{' '}
                {/* ✅ 추가 */}
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null); // 메뉴 닫기
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    setUser(null);
                    navigate('/');
                  }}
                >
                  로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
              <Button
                color="inherit"
                className="auth-button"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* ✅ 하단 네비게이션 바 */}
      <Box
        className={`bottom-nav ${openEventMenu ? 'expanded' : ''}`}
        onMouseEnter={() => setOpenEventMenu(true)}
        onMouseLeave={() => setOpenEventMenu(false)}
      >
        {/* ✅ 메뉴 아이템: 이벤트 */}
        <Box className="nav-item-wrapper">
          <Button className="nav-item">이벤트</Button>
          <Box className="submenu">
            <Button
              onClick={() => navigate('/register')}
              className="submenu-item"
            >
              이벤트 등록
            </Button>
            <Button
              onClick={() => navigate('/search')}
              className="submenu-item"
            >
              이벤트 찾기
            </Button>
          </Box>
        </Box>

        {/* ✅ 메뉴 아이템: 장소 대관 */}
        <Box className="nav-item-wrapper">
          <Button className="nav-item">장소 대관</Button>
          <Box className="submenu">
            <Button onClick={() => navigate('/venue')} className="submenu-item">
              장소 등록
            </Button>
            <Button
              onClick={() => navigate('/venue-search')}
              className="submenu-item"
            >
              대관 찾기
            </Button>
          </Box>
        </Box>

        {/* ✅ 메뉴 아이템: 주변 카페 지도 */}
        <Box className="nav-item-wrapper">
          <Button className="nav-item" onClick={() => navigate('/map')}>
            주변 카페
          </Button>
        </Box>

        {/* ✅ 메뉴 아이템: 즐겨찾기 */}
        <Box className="nav-item-wrapper">
          <Button className="nav-item" onClick={() => navigate('/subscribe')}>
            즐겨찾기
          </Button>
        </Box>

        {/* ✅ 메뉴 아이템: 게시판 */}
        <Box className="nav-item-wrapper">
          <Button className="nav-item" onClick={() => navigate('/board')}>
            게시판
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default NavigationBar;
