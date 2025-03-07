import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/footer/Footer";
import Home from './pages/Home';
import "./styles/App.css";
import LoginPage from "./pages/auth/Login/Login";
import SignupPage from "./pages/auth/SignUp/Signup";
import BirthdayCafeRegister from "./pages/BirthdayCafeRegister/BirthdayCafeRegister";
import { createTheme, ThemeProvider } from "@mui/material";
import RegisterPlaces from "./pages/FindCafes/RegisterPlaces";


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



const Layout = () => {
  return (
    <div className="layout-container">
      <NavigationBar />
      <div className="layout-content">
        <Outlet />  {/* ✅ 페이지 내용 */}
        
      </div>
      <Footer />
    </div>
    
  );
};



function App() {
  return (
    <ThemeProvider theme={theme}> 
        <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/register" element={<BirthdayCafeRegister />} />
            <Route path="/venue" element={<RegisterPlaces/>}/> {/* ✅ 생일카페 등록 추가 */}
            </Route>
        </Routes>
        </Router>
    </ThemeProvider>
    
  );
}

export default App;