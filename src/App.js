import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './Layout'; // ✅ 수정된 Layout 적용
import RequestCodePage from './pages/auth/ForgotPassword/RequestCodePage';
import ResetPasswordPage from './pages/auth/ForgotPassword/ResetPasswordPage';
import VerifyCodePage from './pages/auth/ForgotPassword/VerifyCodePage';
import LoginSuccess from './pages/auth/Login/LoginSuccess';
import SignupPage from './pages/auth/SignUp/Signup';
import BirthdayCafeRegister from './pages/BirthdayCafeRegister/BirthdayCafeRegister';
import Board from './pages/board/Board';
import Post from './pages/board/Post';
import EventCalendar from './pages/calender/EventCalendar';
import Home from './pages/Home';
import KakaoMap from './pages/Map/KakaoMap';
import EditProfile from './pages/profile/EditProfile';
import ProfilePage from './pages/profile/ProfilePage';
import Settings from './pages/settings/Settings';
import RegisterPlaces from './pages/venue/RegisterPlaces';
import './styles/App.css';
import LoginModalWrapper from "./pages/auth/Login/LoginModalWrapper"; // 경로 확인!
import { useLocation } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: `"Pretendard Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: `"Pretendard Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        },
      },
    },
  },
}); // 전체 글꼴을 테마로 지정함.

const location = useLocation();
const state = location.state as { backgroundLocation?: Location };

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Routes location={state?.backgroundLocation || location}>
            <Route path="/" element={<Home />} />
            <Route path="/board" element={<Board />} />
            <Route path="/post" element={<Post />} />
            <Route path="/subscribe" element={<EventCalendar />} />
            <Route path="/register" element={<BirthdayCafeRegister />} />
            <Route path="/profile/:nickname" element={<ProfilePage />} />
            <Route path="/venue" element={<RegisterPlaces />} />{' '}
            <Route path="/map" element={<KakaoMap />} />{' '}
          </Routes>
          {state?.backgroundLocation && (
            <Routes>
              <Route path="/login" element={<LoginModalWrapper />} />
            </Routes>
          )}
            <Route path="/signup" element={<SignupPage />} />
            
            
            {/* ✅ 생일카페 등록 추가 */}
            
            
            
            <Route path="/forgot-password" element={<RequestCodePage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            

            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
