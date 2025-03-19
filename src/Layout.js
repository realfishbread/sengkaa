import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/footer/Footer";

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/signup", "/login"]; // 네비게이션 바를 숨길 페이지

  return (
    <div className="layout-container">
      {/* ✅ 특정 페이지에서만 NavigationBar 숨김 */}
      {!hideNavbarRoutes.includes(location.pathname) && <NavigationBar />}
      
      <div className="layout-content">
        <Outlet />  {/* ✅ 페이지 내용 */}
      </div>

      {/* ✅ Footer는 항상 보이게 설정 */}
      <Footer />
    </div>
  );
};

export default Layout;
