import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const BirthdayCafeRegister = () => {
  const [cafeName, setCafeName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("등록된 생일카페 정보:", { cafeName, address, description, image });
    alert("생일카페가 등록되었습니다!");
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#DCF2FF", // ✅ 메인 배경색과 동일하게
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // ✅ 약간의 그림자 효과
        fontFamily: "'Pretendard Variable', sans-serif", // ✅ 폰트 통일
      }}
    >
      <Typography variant="h5" textAlign="center" marginBottom={2} fontWeight="bold">
        생일카페 등록
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="카페 이름"
          variant="outlined"
          margin="normal"
          value={cafeName}
          onChange={(e) => setCafeName(e.target.value)}
          required
          sx={{ backgroundColor: "white", borderRadius: "6px" }} // ✅ 입력 필드 배경 흰색으로
        />
        <TextField
          fullWidth
          label="주소"
          variant="outlined"
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          sx={{ backgroundColor: "white", borderRadius: "6px" }} // ✅ 입력 필드 배경 흰색으로
        />
        <TextField
          fullWidth
          label="설명"
          variant="outlined"
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: "6px" }} // ✅ 입력 필드 배경 흰색으로
        />
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
            backgroundColor: "#0056b3", // ✅ 네비게이션 버튼과 동일한 색상
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "#004494",
            },
          }}
        >
          등록하기
        </Button>
      </form>
    </Box>
  );
};

export default BirthdayCafeRegister;
