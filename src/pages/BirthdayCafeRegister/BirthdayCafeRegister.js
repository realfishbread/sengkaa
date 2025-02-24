import React, { useState } from "react";
import { TextField, Button, Box, FormControl, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import ImageUploader from "../../components/common/ImageUploader";
import NoticeText from "../../components/common/NoticeText";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { boxStyle, buttonStyle, inputFieldStyle} from "../../components/common/Styles";
import CustomTextField from "../../components/common/CustomTextField";

const BirthdayCafeRegister = () => {
  const [cafeName, setCafeName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [eventDate, setEventDate] =useState("");
  const [selectedStar, setSelectedStar] = useState("");

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("이벤트가 등록되었습니다!");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box sx={boxStyle}>
      <Typography variant="h5" textAlign="center" marginBottom={2} fontWeight="bold">
        이벤트 등록
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="이벤트 이름"
          variant="outlined"
          margin="normal"
          value={cafeName}
          onChange={(e) => setCafeName(e.target.value)}
          required
          sx={inputFieldStyle} // ✅ 입력 필드 배경 흰색으로
        />
        <NoticeText text="* 이벤트 이름은 정확한 정보와 함께 기재해 주세요." />

        {/* ✅ 날짜 선택란 추가 */}
        <DatePicker
            label="이벤트 날짜"
            value={eventDate}
            onChange={(newDate) => setEventDate(newDate)}
            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
          />
          

          {/* ✅ 스타 선택란 추가 */}
          <FormControl fullWidth margin="normal">
            <InputLabel>스타 선택</InputLabel>
            <Select
              value={selectedStar}
              onChange={(e) => setSelectedStar(e.target.value)}
            >
              <MenuItem value="BTS">BTS</MenuItem>
              <MenuItem value="BLACKPINK">BLACKPINK</MenuItem>
              <MenuItem value="EXO">EXO</MenuItem>
              <MenuItem value="TWICE">TWICE</MenuItem>
              <MenuItem value="기타">기타</MenuItem>
            </Select>
          </FormControl>
          <NoticeText text="* 해당 이벤트와 관련된 스타를 선택해 주세요." />

        
          <CustomTextField
            label="주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        
        <CustomTextField
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <ImageUploader onUpload={handleImageUpload} />
        <NoticeText text="* jpg, png만 가능합니다." />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={buttonStyle}
        >
          등록하기
        </Button>
      </form>
    </Box>
    </LocalizationProvider>
  );
};

export default BirthdayCafeRegister;
