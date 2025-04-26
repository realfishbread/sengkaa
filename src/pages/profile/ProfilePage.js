import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/api/axiosInstance";
import { Box, Avatar, Typography, CircularProgress, Divider, Paper, Button } from "@mui/material";
import { UserContext } from "../../context/UserContext";

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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Avatar
          src={profile.profile_image}
          alt={profile.username}
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          {profile.username}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
          {profile.email}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          가입일: {new Date(profile.created_at).toLocaleDateString()}
        </Typography>

        {/* ✅ 내 프로필일 때만 수정 버튼 보여주기 */}
        {isMyProfile && (
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 3 }}
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
