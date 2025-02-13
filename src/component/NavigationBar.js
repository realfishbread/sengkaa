import { Box, Link } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const navigate = useNavigate();

  const navItems = [
    { name: "생일카페 등록", path: "/register" },
    { name: "카페 찾기", path: "/search" },
    { name: "장소 대관", path: "/venue" },
    { name: "콜라보 소식", path: "/collab" },
    { name: "주변 카페 지도", path: "/map" }
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#DCF2FF",
        padding: "10px 0",
        borderBottom: "1px solid #c7c7c7",
        display: "flex",
        justifyContent: "center",
        maxWidth: "600px",  // ✅ 너비를 600px로 제한
        margin: "0 auto",  // ✅ 가운데 정렬
        borderRadius: "8px", // ✅ 살짝 둥근 모서리 추가
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // ✅ 살짝 그림자 추가
      }}
    >
      {navItems.map((item, index) => (
        <Link
          key={index}
          component="button"
          onClick={() => navigate(item.path)}
          onMouseEnter={() => setActiveNavItem(index)}
          onMouseLeave={() => setActiveNavItem(null)}
          sx={{
            margin: "0 10px",
            color: activeNavItem === index ? "#0056b3" : "#000000",
            fontSize: activeNavItem === index ? "1.1rem" : "1rem",
            textDecoration: "none",
            fontWeight: activeNavItem === index ? "bold" : "normal",
            transition: "color 0.3s ease, font-size 0.3s ease",
            cursor: "pointer",
            background: "none",
            border: "none",
            outline: "none",
          }}
        >
          {item.name}
        </Link>
      ))}
    </Box>
  );
}

export default NavigationBar;