import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../shared/api/axiosInstance";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const savedUser = JSON.parse(localStorage.getItem("userInfo"));
      if (savedUser) setUser(savedUser);
    }

    axiosInstance
      .get("/user/posts/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 6, px: 2 }}>
      {/* 헤더 */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight="bold">
          🎂 생일카페 공동주최자 모집 게시판
        </Typography>
        <Button variant="contained" onClick={() => navigate("/post")}>
          글 작성
        </Button>
      </Stack>

      {/* 글 목록 */}
      {posts.map((post) => (
        <Paper
          key={post.id}
          elevation={1}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            backgroundColor: "#fff",
            "&:hover": {
              borderColor: "#1e88e5",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            },
          }}
        >
          {/* 작성자 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={post.profile_image} alt={post.username} />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {post.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* 구분선 */}
          <Divider sx={{ my: 2 }} />

          {/* 제목 + 내용 */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-line",
              color: "#444",
              lineHeight: 1.6,
              maxHeight: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.content}
          </Typography>

          {/* 이미지 */}
          {post.image && (
            <Box mt={2}>
              <img
                src={post.image}
                alt="썸네일"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Box>
          )}

          {/* 모집중 태그 */}
          <Box mt={2}>
            <Chip label="모집중" color="success" size="small" />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default Board;
