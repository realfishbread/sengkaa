import { Avatar, Box, Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../shared/api/axiosInstance";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useContext(UserContext);  // ✅ 로그인된 유저
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/user/profile/${username}/`)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [username]);

  if (loading) return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (!profile) return (
    <Typography sx={{ textAlign: "center", mt: 10 }}>
      사용자 정보를 불러올 수 없습니다.
    </Typography>
  );

  const isMyProfile = user?.username === profile.username; // ✅ 비교!

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: "20px",
          background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
        }}
      >
        <Avatar
          src={profile.profile_image}
          alt={profile.username}
          sx={{
            width: 110,
            height: 110,
            mx: "auto",
            mb: 2,
            border: "3px solid #6C63FF",
            backgroundColor: "#e0e0e0",
          }}
        />
        <Typography variant="h5" fontWeight="bold" textAlign="center" color="#333">
          {profile.username}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center" mt={1}>
          {profile.email}
        </Typography>

        <Divider sx={{ my: 4, borderColor: "#eee" }} />

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ fontSize: 15 }}
        >
          가입일: {new Date(profile.created_at).toLocaleDateString()}
        </Typography>

        {isMyProfile && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.5,
              backgroundColor: "#6C63FF",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "12px",
              textTransform: "none",
              '&:hover': {
                backgroundColor: "#5a55d3",
              },
            }}
            onClick={() => navigate("/edit-profile")}
          >
            ✏️ 프로필 수정
          </Button>
        )}
      </Paper>
    </Box>

  );
};

export default ProfilePage;
