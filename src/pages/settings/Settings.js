import { Box, Typography, Paper, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Settings, Lock, Notifications, Delete } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();


  return (
    <Box sx={{ maxWidth: 600, mx: "auto", my: 6, px: 2 }}>
      {/* 상단 프로필 카드 */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: 3,
          mb: 5,
        }}
      >
        <Avatar
          src={user?.profile_image || ""}
          alt={user?.username}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Paper>

      {/* 설정 항목 리스트 */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
        <List>
        <ListItem button onClick={() => navigate(`/profile/${user?.username}/`)}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="계정 설정" />
        </ListItem>

          <Divider />

          <ListItem button onClick={() => navigate('/forgot-password/')}>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="비밀번호 변경" />
          </ListItem>

          <Divider />

          <ListItem button>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText primary="알림 설정" />
          </ListItem>

          <Divider />

          <ListItem button sx={{ color: "red" }}>
            <ListItemIcon>
              <Delete color="error" />
            </ListItemIcon>
            <ListItemText primary="회원 탈퇴" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
