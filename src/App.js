import { createTheme, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import RequestCodePage from './pages/auth/ForgotPassword/RequestCodePage';
import ResetPasswordPage from './pages/auth/ForgotPassword/ResetPasswordPage';
import VerifyCodePage from './pages/auth/ForgotPassword/VerifyCodePage';
import KakaoRedirectPage from './pages/auth/Login/KakaoRedirectPage';
import LoginModalWrapper from './pages/auth/Login/LoginModalWrapper';
import SignupPage from './pages/auth/SignUp/Signup';
import FavoriteEvents from './pages/bias-event/FavoriteEvents';
import BirthdayCafeDetailPage from './pages/birthday-cafe-register/BirthdayCafeDetailPage';
import BirthdayCafeRegister from './pages/birthday-cafe-register/BirthdayCafeRegister';
import SearchPlaces from './pages/birthday-cafe-register/SearchPlaces';
import Board from './pages/board/Board';
import ModifyPost from './pages/board/ModifyPost';
import Post from './pages/board/Post';
import MyBookingsPage from './pages/booking/my-booking-page/MyBookingsPage';
import PaymentFailPage from './pages/booking/PaymentFailPage';
import PaymentSuccessPage from './pages/booking/PaymentSuccessPage';
import EventCalendar from './pages/calender/EventCalendar';
import ChatLobbyPage from './pages/chat/ChatLobbyPage';
import ChatPage from './pages/chat/ChatPage';
import DictionaryList from './pages/dictionary/DictionaryList';
import FaqPage from './pages/faq/FaqPage';
import Home from './pages/Home';
import KakaoMap from './pages/map/KakaoMap';
import EditProfile from './pages/profile/EditProfile';
import ProfilePage from './pages/profile/ProfilePage';
import SearchResults from './pages/search/SearchResult';
import Settings from './pages/settings/Settings';
import StarDetailPage from './pages/star/StarDetailPage';
import VenueSearch from './pages/venue/find-cafes/VenueSearch';
import RegisterPlaces from './pages/venue/RegisterPlaces/RegisterPlaces';
import VenueDetailPage from './pages/venue/venue-detail/VenueDetailPage';
import {
  injectLoginModalHandler,
  injectNavigateToLogin,
} from './shared/api/axiosInstance';

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
  const state = location.state;
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    injectLoginModalHandler(() => setShowLoginModal(true));
    injectNavigateToLogin(navigate);
  }, [navigate]);

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/login" element={<LoginModalWrapper />} />
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
          <Route path="post/edit/:postId" element={<ModifyPost />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="oauth/kakao/redirect" element={<KakaoRedirectPage />} />
          <Route path="venues/:id" element={<VenueDetailPage />} />
          <Route
            path="birthday-cafes/:id"
            element={<BirthdayCafeDetailPage />}
          />
          <Route path="chat/:roomId" element={<ChatPage />} />
          <Route path="result" element={<SearchResults />} />
          <Route path="/favorite-events" element={<FavoriteEvents />} />
          <Route
            path="/payment/success/page/"
            element={<PaymentSuccessPage />}
          />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
          <Route path="chat-list" element={<ChatLobbyPage />} />
          <Route path="star/:id" element={<StarDetailPage />} />
        </Route>
      </Routes>
      {state?.backgroundLocation && location.pathname === '/login' && (
        <LoginModalWrapper open={true} onClose={() => navigate(-1)} />
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
