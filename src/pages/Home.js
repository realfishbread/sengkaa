import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState(null);

  const navItems = [
    { name: "생일카페 등록", path: "/register" },
    { name: "카페 찾기", path: "/search" },
    { name: "장소 대관", path: "/venue" },
    { name: "콜라보 소식", path: "/collab" },
    { name: "주변 카페 지도", path: "/map" }
  ];

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "#b3dff0" }}>
        <Toolbar>
          <img src="/images/logo.png" alt="Event Cafe Logo" style={{ height: "50px" }} />
          <TextField variant="outlined" placeholder="찾으시는 최애가 있으신가요?" size="small" style={{ marginLeft: "auto" }} />
          <Button color="inherit" onClick={() => navigate("/login")}>로그인</Button>
          <Button color="inherit" onClick={() => navigate("/signup")}>회원가입</Button>
        </Toolbar>
      </AppBar>

      <Box style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
        {navItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setActiveNavItem(index)}
            onMouseLeave={() => setActiveNavItem(null)}
            style={{
              margin: "0 15px",
              color: activeNavItem === index ? "#0056b3" : "#000000",
              fontSize: activeNavItem === index ? "1.1rem" : "1rem",
              fontWeight: activeNavItem === index ? "bold" : "normal",
              transition: "color 0.3s ease, font-size 0.3s ease",
              background: "none",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>
    </div>
  );
};

export default Home;
