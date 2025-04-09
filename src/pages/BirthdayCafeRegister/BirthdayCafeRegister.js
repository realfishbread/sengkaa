import React, { useState, useEffect } from "react";
import { TextField, Button, Box, FormControl, Typography, createFilterOptions } from "@mui/material";
import ImageUploader from "../../components/common/ImageUploader";
import NoticeText from "../../components/common/NoticeText";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { boxStyle, buttonStyle, inputFieldStyle, titleStyle} from "../../components/common/Styles";
import CustomTextField from "../../components/common/CustomTextField";
import Autocomplete from "@mui/material/Autocomplete";

const BirthdayCafeRegister = () => {
  const [cafeName, setCafeName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [eventDate, setEventDate] =useState("");
  const [selectedStar, setSelectedStar] = useState("");

  const [idolList, setIdolList] = useState([]);


  useEffect(() => {
    fetch("/data/idols.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ 아이돌 불러오기:", data);
        setIdolList(data);
      })
      .catch((err) => {
        console.error("❌ 오류 발생:", err);
      });
  }, []);

  const filter = createFilterOptions({
    stringify: (option) =>
      [option.display, option.name, option.group, ...(option.keywords || [])].join(" ")
  });
  

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
      <Typography sx={titleStyle}>
        이벤트 등록
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <CustomTextField
          label="이벤트 이름"
          value={cafeName}
          onChange={(e) => setCafeName(e.target.value)}
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
          <Autocomplete
              options={idolList}
              getOptionLabel={(option) => (option && option.display) || ""}
              filterOptions={filter}
              onChange={(event, newValue) => {
                setSelectedStar(newValue ? newValue.display : "");
              }}
              renderInput={(params) => (
                <TextField {...params} label="스타 검색" margin="normal" fullWidth />
              )}
            />
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
