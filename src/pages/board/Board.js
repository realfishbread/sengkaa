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
  const [openPostId, setOpenPostId] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [replies, setReplies] = useState({});
  const [filter, setFilter] = useState("all");



  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const savedUser = JSON.parse(localStorage.getItem("userInfo"));
      if (savedUser) setUser(savedUser);
    }

    fetchPosts("all"); // ✅ 최초 로딩
  }, []);

  const fetchPosts = (type) => {
    setFilter(type);
  
    let url = "/user/posts/";
    if (type === "open") url = "/user/posts/open/";
    else if (type === "closed") url = "/user/posts/closed/";
  
    axiosInstance
      .get(url)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  };

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleReplySubmit = (postId) => {
    if (!replyContent[postId]) return; // 빈 댓글 방지
  
    axiosInstance
      .post("/user/replies/", {
        post: postId,
        content: replyContent[postId],
      })
      .then((res) => {
        alert("댓글이 등록되었습니다!");
        setReplyContent((prev) => ({ ...prev, [postId]: "" }));
        // ✅ 댓글 등록 성공 후 댓글 목록 새로고침할 수 있으면 좋아
      })
      .catch((err) => {
        console.error(err);
        alert("댓글 등록에 실패했습니다.");
      });
  };
  
  const fetchReplies = (postId) => {
    axiosInstance
      .get(`/user/posts/${postId}/replies/`)
      .then((res) => {
        setReplies((prev) => ({ ...prev, [postId]: res.data }));
      });
  };

  

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 6, px: 2 }}>
      {/* ✅ 예쁜 배경 헤더 */}
      <Box
  sx={{
    width: "100%",
    py: 6,
    px: 2,
    borderRadius: 3,
    backgroundColor: "#f0fff4", // 👉 배경색 따로 분리!
    backgroundImage: `
      radial-gradient(circle at 20% 40%, rgba(30, 136, 229, 0.12) 120px, transparent 120px),
      radial-gradient(circle at 70% 60%, rgba(30, 136, 229, 0.08) 120px, transparent 120px),
      radial-gradient(circle at 70% 60%, rgba(30, 136, 229, 0.08) 120px, transparent 120px)
    `,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    mb: 4,
  }}
>
  <Typography
    variant="h4"
    fontWeight="bold"
    sx={{
      color: "Black",
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    }}
  >
    🎂 팬 이벤트 공동주최자 모집 게시판
  </Typography>
  <Typography variant="subtitle1" sx={{ mt: 1, color: "#555" }}>
    함께할 동료를 찾고, 더 특별한 이벤트를 만들어보세요 💫
  </Typography>
</Box>

  <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
    <Button
      variant={filter === "all" ? "contained" : "outlined"}
      onClick={() => fetchPosts("all")}
    >
      전체
    </Button>
    <Button
      variant={filter === "open" ? "contained" : "outlined"}
      onClick={() => fetchPosts("open")}
    >
      모집중
    </Button>
    <Button
      variant={filter === "closed" ? "contained" : "outlined"}
      onClick={() => fetchPosts("closed")}
    >
      모집완료
    </Button>
  </Stack>


  {/* ✅ 글작성 버튼 오른쪽 정렬 */}
  <Box sx={{ textAlign: "right", mb: 4 }}>
    <Button variant="contained" onClick={() => navigate("/post")}>
      글 작성
    </Button>
  </Box>


      {/* 글 목록 */}
      {posts.map((post) => (
        <Paper
        key={post.id}
        onClick={() => setOpenPostId(post.id)}   // ✅ 클릭하면 열리게
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#fff",
          cursor: "pointer",
          "&:hover": {
            borderColor: "#1e88e5",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          },
        }}
      >
        {openPostId === post.id && (
           <>
           {/* 댓글 목록 */}
           {replies[post.id]?.map((reply) => (
             <Typography key={reply.id} variant="body2" sx={{ mt: 1, pl: 2 }}>
               💬 {reply.user.username}: {reply.content}
             </Typography>
           ))}
        <Box mt={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              value={replyContent[post.id] || ""}
              onChange={(e) =>
                setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
              }
              style={{
                flexGrow: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleReplySubmit(post.id)}
            >
              등록
            </Button>
          </Stack>
        </Box>
        </>
      )}
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
