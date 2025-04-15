import React, { useState } from "react";
import { Box, TextField, Button, Avatar, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

const Post = ({ onSubmitPost }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handlePost = () => {
    if (!text.trim()) return;
    onSubmitPost({ text, image }); // 부모 컴포넌트로 전달
    setText("");
    setImage(null);
  };

  return (
        <Box
        sx={{
            maxWidth: 700,           // 📌 폭 제한
            mx: "auto",              // 📌 가운데 정렬
            mt: 4, mb: 6,            // 📌 위아래 여백
            px: 2                   // 📌 좌우 패딩
        }}
        >
      <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid #ddd',
            borderRadius: 2,
            padding: 2,
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
        >

        <Avatar alt="user" />
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="무슨 생일카페를 준비하고 계신가요?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      {image && <img src={image} alt="preview" style={{ width: '100%', borderRadius: '8px' }} />}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton component="label">
          <ImageIcon />
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </IconButton>
        <Button variant="contained" onClick={handlePost}>게시</Button>
      </Box>
    </Box>
  );
};

export default Post;
