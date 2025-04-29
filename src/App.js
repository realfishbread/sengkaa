import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
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
import LoginModalWrapper from "./pages/auth/Login/LoginModalWrapper";

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
});

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board" element={<Board />} />
          <Route path="post" element={<Post />} />
          <Route path="subscribe" element={<EventCalendar />} />
          <Route path="register" element={<BirthdayCafeRegister />} />
          <Route path="profile/:nickname" element={<ProfilePage />} />
          <Route path="venue" element={<RegisterPlaces />} />
          <Route path="map" element={<KakaoMap />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<RequestCodePage />} />
          <Route path="verify-code" element={<VerifyCodePage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="login-success" element={<LoginSuccess />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* ✅ 로그인 모달은 백그라운드 location 있을 때만 렌더링 */}
      {state?.backgroundLocation && (
        <Routes>
        <Route
        path="/login"
        element={<LoginModalWrapper open={true} onClose={() => navigate(-1)} />}
      />
      </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
