import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import RequestCodePage from './pages/auth/ForgotPassword/RequestCodePage';
import ResetPasswordPage from './pages/auth/ForgotPassword/ResetPasswordPage';
import VerifyCodePage from './pages/auth/ForgotPassword/VerifyCodePage';
import KakaoRedirectPage from './pages/auth/Login/KakaoRedirectPage';
import LoginModalWrapper from './pages/auth/Login/LoginModalWrapper';
import SignupPage from './pages/auth/SignUp/Signup';
import FavoriteStarModal from './pages/bias/FavoriteStarModal';
import BirthdayCafeRegister from './pages/birthday-cafe-register/BirthdayCafeRegister';
import SearchPlaces from './pages/birthday-cafe-register/SearchPlaces';
import Board from './pages/board/Board';
import ModifyPost from './pages/board/ModifyPost';
import Post from './pages/board/Post';
import EventCalendar from './pages/calender/EventCalendar';
import DictionaryList from './pages/dictionary/DictionaryList';
import FaqPage from './pages/faq/FaqPage';
import VenueSearch from './pages/venue/find-cafes/VenueSearch';
import Home from './pages/Home';
import KakaoMap from './pages/map/KakaoMap';
import EditProfile from './pages/profile/EditProfile';
import ProfilePage from './pages/profile/ProfilePage';
import Settings from './pages/settings/Settings';
import RegisterPlaces from './pages/venue/RegisterPlaces/RegisterPlaces';
import MyBookingsPage from './pages/booking/my-booking-page/MyBookingsPage';
import VenueDetailPage from './pages/venue/venue-detail/VenueDetailPage';
import BirthdayCafeDetailPage from './pages/birthday-cafe-register/BirthdayCafeDetailPage';
import ChatPage from './pages/chat/ChatPage';
import SearchResults from './pages/search/SearchResult';
import './styles/App.css';

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
          <Route path="calendar" element={<EventCalendar />} />
          <Route path="register" element={<BirthdayCafeRegister />} />
          <Route path="profile/:nickname" element={<ProfilePage />} />
          <Route path="venue" element={<RegisterPlaces />} />
          <Route path="map" element={<KakaoMap />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<RequestCodePage />} />
          <Route path="verify-code" element={<VerifyCodePage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="dictionary" element={<DictionaryList />} />
          <Route path="search" element={<SearchPlaces />} />
          <Route path="venue-search" element={<VenueSearch />} />
          <Route path="/post/edit/:postId" element={<ModifyPost />} />
          <Route path="/select-star" element={<FavoriteStarModal />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/oauth/kakao/redirect" element={<KakaoRedirectPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/birthday-cafes/:id" element={<BirthdayCafeDetailPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>

      {/* ✅ 로그인 모달은 백그라운드 location 있을 때만 렌더링 */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={
              <LoginModalWrapper open={true} onClose={() => navigate(-1)} />
            }
          />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
