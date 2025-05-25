import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';
import Logo from '../common/Logo';
import './NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpenDrawer(open);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }
  
      try {
        const response = await axiosInstance.get(`/user/star/stars/?keyword=${searchTerm}`);
        setSearchResults(response.data); // 스타 리스트
      } catch (error) {
        console.error('스타 검색 실패 ❌', error);
        setSearchResults([]);
      }
    }, 300); // debounce 300ms
  
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>
      {/* 상단 내비게이션 바 */}
      <AppBar position="static" className="navbar">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
          className="upper-navbar-container"
        >
          {/* 왼쪽: 로고 */}
          <Box className="logo-container">
            <Logo />
          </Box>

          {/* 오른쪽: 로그인/회원가입 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <IconButton onClick={toggleDrawer(true)}>
                <Avatar src={user?.profile_image || ''} alt={user?.nickname}>
                  {user?.nickname ? user?.nickname[0] : ''}
                </Avatar>
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  className="auth-button light"
                  onClick={() =>
                    navigate('/login', {
                      state: { backgroundLocation: location },
                    })
                  }
                >
                  로그인
                </Button>
                <Button
                  className="auth-button dark"
                  onClick={() => navigate('/signup')}
                >
                  회원가입
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 하단 내비게이션 바 */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className="bottom-navbar-container"
      >
        <Toolbar className="bottom-navbar-toolbar">
          {/* 메뉴 아이템 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 중앙: 메뉴 */}
            <Box className="nav-menu" sx={{ display: 'flex', gap: 2 }}>
              <Box className="nav-item-wrapper">
                {/* 메뉴 아이템: 이벤트 */}
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

              {/* 메뉴 아이템 : 장소 대관 */}
              <Box className="nav-item-wrapper">
                <Button className="nav-item">장소 대관</Button>
                <Box className="submenu">
                  <Button
                    onClick={() => navigate('/venue')}
                    className="submenu-item"
                  >
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

              <Button className="nav-item" onClick={() => navigate('/map')}>
                주변 카페
              </Button>
              <Button
                className="nav-item"
                onClick={() => navigate('/calendar')}
              >
                캘린더
              </Button>
              <Button className="nav-item" onClick={() => navigate('/board')}>
                게시판
              </Button>
            </Box>
          </Box>

          {/* 검색창 */}
          <TextField
            variant="outlined"
            placeholder="찾으시는 최애가 있으신가요?"
            size="small"
            className="search-bar"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
                setSearchTerm('');
              }
            }}
          />
          
        </Toolbar>
      </AppBar>

      <Divider sx={{ borderBottomWidth: 1, borderColor: '#eee' }} />

      {/* Drawer (사용자 프로필, 설정 등) */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, p: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Avatar
              src={user?.profile_image || ''}
              alt={user?.nickname}
              sx={{ width: 80, height: 80, margin: 'auto' }}
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
              {user?.nickname || '사용자'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || '이메일 없음'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem
              button
              onClick={() => navigate(`/profile/${user?.nickname}`)}
            >
              <ListItemText primary="내 프로필" />
            </ListItem>
            <ListItem button onClick={() => navigate('/settings')}>
              <ListItemText primary="설정" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dictionary')}>
              <ListItemText primary="덕질 사전" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                navigate('/');
              }}
            >
              <ListItemText primary="로그아웃" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationBar;
