import React, { useState, useEffect } from "react";
import { TextField, Button, Box, FormControl, Typography, createFilterOptions, Divider } from "@mui/material";
import ImageUploader from "../../components/common/ImageUploader";
import NoticeText from "../../components/common/NoticeText";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { boxStyle, buttonStyle, titleStyle} from "../../components/common/Styles";
import CustomTextField from "../../components/common/CustomTextField";
import Autocomplete from "@mui/material/Autocomplete";

const BirthdayCafeRegister = () => {
  const [cafeName, setCafeName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  
  const [selectedStar, setSelectedStar] = useState("");

 
  const [genre, setGenre] = useState("idol"); // 유저가 선택한 장르
  const [starList, setStarList] = useState([]); // 선택된 장르의 리스트만 담김

  const [roadAddress, setRoadAddress] = useState("");  // 도로명주소
const [detailAddress, setDetailAddress] = useState("");  // 상세주소

const [goodsName, setGoodsName] = useState("");
const [goodsDescription, setGoodsDescription] = useState("");
const [goodsImage, setGoodsImage] = useState(null);
const [goodsPrice, setGoodsPrice] = useState("");

const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);



  useEffect(() => {
    fetch(`/data/${genre}.json`)
      .then((res) => res.json())
      .then((data) => {
        setStarList(data);  // ⭐ Autocomplete에 들어갈 options
      })
      .catch((err) => {
        console.error("로딩 실패 ❌", err);
        setStarList([]);
      });
  }, [genre]);
  

  const filter = createFilterOptions({
    stringify: (option) =>
      [option.display, option.name, option.group, ...(option.keywords || [])].join(" ")
  });

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullRoadAddr = data.roadAddress; // 도로명 주소
        setRoadAddress(fullRoadAddr);
      }
    }).open();
  };
  
 

  

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

      <Divider sx={{ my: 4 }}>기본 정보</Divider>
      
      <form onSubmit={handleSubmit}>
        <CustomTextField
          label="이벤트 이름"
          value={cafeName}
          onChange={(e) => setCafeName(e.target.value)}
        />
        <NoticeText text="* 이벤트 이름은 정확한 정보와 함께 기재해 주세요." />

        <Box sx={{ display: "flex", gap: 2 }}>
          <DatePicker
            label="시작일"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
          <DatePicker
            label="종료일"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Box>

      <Divider sx={{ my: 4 }}>장르 및 대상 선택</Divider>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {["idol", "youtuber", "comic", "webtoon", "game"].map((g) => (
            <Button
              key={g}
              variant={genre === g ? "contained" : "outlined"}
              onClick={() => setGenre(g)}
            >
              {{
                idol: "아이돌",
                youtuber: "유튜버",
                comic: "만화",
                webtoon: "웹툰",
                game: "게임",
              }[g]}
            </Button>
          ))}
        </Box>



          

          {/* ✅ 스타 선택란 추가 */}
          <Autocomplete
            options={starList} // ⭐ 장르에 따라 바뀜
            getOptionLabel={(option) => (option && option.display) || ""}
            filterOptions={filter}
            onChange={(event, newValue) => {
              setSelectedStar(newValue); // ⭐ 유튜버든 아이돌이든 저장 가능
            }}
            renderInput={(params) => (
              <TextField {...params} label={`${genre} 검색`} margin="normal" fullWidth />
            )}
          />

            {selectedStar && selectedStar.image && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <img
                src={selectedStar.image}
                alt={selectedStar.display}
                style={{ width: '160px', borderRadius: '10px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = "none"; // 이미지 없으면 안보이게
                }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>{selectedStar.display}</Typography>
            </Box>
          )}
          <NoticeText text="* 해당 이벤트와 관련된 스타를 선택해 주세요." />

          
          
          <Divider sx={{ my: 4 }}>주소 입력</Divider>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <TextField
              label="도로명 주소"
              value={roadAddress}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <Button
              variant="outlined"
              onClick={openPostcode}
              sx={{ whiteSpace: "nowrap", height: "56px" }} // 버튼 높이 맞춤
            >
              주소 찾기
            </Button>
          </Box>
          <CustomTextField
            label="상세 주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            required
          />


          <Divider sx={{ my: 4 }}>굿즈 정보</Divider>

          <CustomTextField
            label="굿즈 이름"
            value={goodsName}
            onChange={(e) => setGoodsName(e.target.value)}
          />

          <CustomTextField
            label="굿즈 설명"
            value={goodsDescription}
            onChange={(e) => setGoodsDescription(e.target.value)}
            multiline
            rows={3}
          />

          <ImageUploader onUpload={(e) => setGoodsImage(e.target.files[0])} />
          <NoticeText text="* 굿즈 이미지(jpg, png) 업로드" />

          <CustomTextField
            label="가격 (원)"
            type="number"
            value={goodsPrice}
            onChange={(e) => setGoodsPrice(e.target.value)}
          />

        <Divider sx={{ my: 4 }}>카페 진행 설명</Divider>
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
