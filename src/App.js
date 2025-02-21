import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import Home from './pages/Home';
import "./styles/App.css";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import BirthdayCafeRegister from "./pages/BirthdayCafeRegister";
import { createTheme, ThemeProvider } from "@mui/material";


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
      <>
        <NavigationBar />  {/* ✅ 네비게이션 바 고정 */}
        <Outlet />  {/* ✅ 이 부분만 페이지에 따라 변경됨 */}
        
      </>
    );
  };



function App() {
  return (
    <ThemeProvider theme={theme}> 
        <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route index element={<Footer />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/register" element={<BirthdayCafeRegister />} /> {/* ✅ 생일카페 등록 추가 */}
            </Route>
        </Routes>
        </Router>
    </ThemeProvider>
    
  );
}

export default App;