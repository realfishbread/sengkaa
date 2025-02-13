import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "./component/NavigationBar";
import App from "./App";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import BirthdayCafeRegister from "./pages/BirthdayCafeRegister";


const Layout = () => {
    return (
      <>
        <NavigationBar />  {/* ✅ 네비게이션 바 고정 */}
        <Outlet />  {/* ✅ 이 부분만 페이지에 따라 변경됨 */}
      </>
    );
  };

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<BirthdayCafeRegister />} /> {/* ✅ 생일카페 등록 추가 */}
      </Routes>
    </Router>
  );
}

export default MainApp;
