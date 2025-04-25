import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Avatar, Divider, Chip } from "@mui/material";

const Board = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("https://eventcafe.site/user/posts/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4, px: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🎂 생일카페 공동주최자 모집 게시판
      </Typography>

      {posts.map((post) => (
        <Box
          key={post.id}
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
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

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-line",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: "100px",
            }}
          >
            {post.content}
          </Typography>

          {post.image && (
            <Box mt={2}>
              <img
                src={post.image}
                alt="썸네일"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Box>
          )}

          {/* 모집중/완료 태그도 여기에 조건부 렌더링 가능 */}
          <Box mt={2}>
            <Chip label="모집중" color="success" size="small" />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Board;
