import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const RegisterCollab = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [product, setProduct] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("콜라보 소식 등록:", { title, date, product, image });
    alert("콜라보 소식이 등록되었습니다!");
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#DCF2FF",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Pretendard Variable', sans-serif",
      }}
    >
      <Typography variant="h5" textAlign="center" marginBottom={2} fontWeight="bold">
        콜라보 소식 등록
      </Typography>

      <form onSubmit={handleSubmit}>
        <Typography variant="subtitle1" fontWeight="bold" marginTop={2}>
          콜라보 제목
        </Typography>
        <TextField
          fullWidth
          placeholder="제목을 입력하세요"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ backgroundColor: "white", borderRadius: "6px" }}
        />

        <Typography variant="subtitle1" fontWeight="bold" marginTop={2}>
          콜라보 기간
        </Typography>
        <TextField
          fullWidth
          placeholder="기간을 입력하세요"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ backgroundColor: "white", borderRadius: "6px" }}
        />

        <Typography variant="subtitle1" fontWeight="bold" marginTop={2}>
          콜라보 내용
        </Typography>
        <TextField
          fullWidth
          placeholder="내용을 입력하세요"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ backgroundColor: "white", borderRadius: "6px" }}
        />

        <Typography variant="subtitle1" fontWeight="bold" marginTop={3}>
          콜라보 이미지
        </Typography>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            margin: "1rem 0",
            display: "block",
            width: "100%",
            padding: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "#DCF2FF",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "#ad1457",
            },
          }}
        >
          등록하기
        </Button>
      </form>
    </Box>
  );
};

export default RegisterCollab;