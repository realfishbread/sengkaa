import React, { useState } from "react";
import { TextField, Button, Box, Typography, ToggleButton, ToggleButtonGroup, Divider } from "@mui/material";
import ImageUploader from "../../components/common/ImageUploader";
import NoticeText from "../../components/common/NoticeText";
import CustomTextField from "../../components/common/CustomTextField";
import { boxStyle, buttonStyle, titleStyle } from "../../components/common/Styles";
import AddressInput from "../../components/common/AddressInput";


const VenueRegister = () => {
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState(""); // 장소 타입 선택
  const [roadAddress, setRoadAddress] = useState("");  // 도로명주소
  const [detailAddress, setDetailAddress] = useState("");  // 상세주소
  const [mainImage, setMainImage] = useState(null); // 가게 메인 이미지
  const [rentalFee, setRentalFee] = useState("");
  const [deposit, setDeposit] = useState("");
  const [operatingInfo, setOperatingInfo] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [benefitsImage, setBenefitsImage] = useState(null); // 특전 예시 이미지
  const [description, setDescription] = useState("");
  const [snsType, setSnsType] = useState(""); // ✅ SNS 선택 상태
  const [snsAccount, setSnsAccount] = useState(""); // ✅ SNS 계정 입력 상태

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = (event, setImage) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };
  
  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullRoadAddr = data.roadAddress; // 도로명 주소
        setRoadAddress(fullRoadAddr);
      }
    }).open();
  };

  // ✅ 폼 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("장소가 등록되었습니다!");
  };

  return (
    <Box sx={boxStyle}>
      
      <Typography sx={titleStyle}>
        장소 등록
      </Typography>
      <Box sx={{ marginBottom: "60px" }} /> 

      <form onSubmit={handleSubmit}>

      
        
      <Box
       sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: '#fdfdfd',
      }}
      >
        {/* ✅ 장소명 입력 */}
        <CustomTextField label="장소명" value={venueName} onChange={(e) => setVenueName(e.target.value)} required />

     
        {/* ✅ 주소 입력 & 검색 버튼 */}
        
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
        </Box>
        
       
        <Box sx={{ marginBottom: "60px" }} /> 
      <Box
       sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: '#fdfdfd',
      }}
      >
        <Typography variant="subtitle1" fontWeight="bold" >장소의 타입을 선택해 주세요 (필수)</Typography>
        <ToggleButtonGroup
          value={venueType}
          exclusive
          onChange={(event, newValue) => setVenueType(newValue)}
          className="venue-type-group"
        >
          {["카페", "음식점", "전시회", "포토부스", "파티룸"].map((type) => (
            <ToggleButton
              key={type}
              value={type}
              className="venue-type-button"
              disableRipple
            >
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        </Box>
        
        
       
        <Box sx={{ marginBottom: "60px" }} /> 
        <Box
       sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: '#fdfdfd',
        
      }}
      >

        
        {/* ✅ 가게 메인 이미지 업로드 */}
        <Typography variant="subtitle1" fontWeight="bold"  >가게 메인 이미지 (필수)</Typography>
        
        <ImageUploader onUpload={(event) => handleImageUpload(event, setMainImage)} />
        {mainImage && <img src={mainImage} alt="미리보기" style={{ width: "100px", marginTop: "10px" }} />}
        <NoticeText text="* jpg, png만 가능합니다." />
        </Box>

        <Box sx={{ marginBottom: "60px" }} /> 


        {/* ✅ 대관료 & 예약금 입력 */}
        <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '24px',
          backgroundColor: '#fdfdfd',
        }}
      >
        <Box sx={{ display: "flex", gap: "10px" }}>
          <CustomTextField label="대관료 (₩)" value={rentalFee} onChange={(e) => setRentalFee(e.target.value)} required />
          <CustomTextField label="예약금 (₩)" value={deposit} onChange={(e) => setDeposit(e.target.value)} required />
        </Box>

        {/* ✅ 운영 정보 입력 */}
        <CustomTextField label="운영 정보" value={operatingInfo} onChange={(e) => setOperatingInfo(e.target.value)} multiline rows={2} />

        {/* ✅ 운영 시간 입력 */}
        <CustomTextField label="운영 시간" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} required />
        </Box>

        <Box sx={{ marginBottom: "60px" }} /> 


        {/* ✅ 특전 이미지 업로드 */}
        <Box
       sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: '#fdfdfd',
      }}
      >
        <Typography variant="subtitle1" fontWeight="bold" >특전 배치 혹은 예시 이미지</Typography>
        <ImageUploader onUpload={(event) => handleImageUpload(event, setBenefitsImage)} />
        {benefitsImage && <img src={benefitsImage} alt="미리보기" style={{ width: "100px", marginTop: "10px" }} />}
        <NoticeText text="* jpg, png만 가능합니다." />

        {/* ✅ 소개글 입력 */}
        <CustomTextField label="소개글" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} />
        </Box>

        <Box sx={{ marginBottom: "60px" }} /> 
         {/* ✅ SNS 선택 및 계정 입력 */}

         <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: '#fdfdfd',
            display: 'flex',
            flexDirection: 'column',
            gap: 2, // 요소 간 간격
            mt: 2 
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" marginBottom={1}>
            SNS 아이디
          </Typography>

          {/* 버튼 그룹 */}
          {/* 🔷 파란 배경의 버튼 박스 */}
            
          <ToggleButtonGroup
            value={snsType}
            exclusive
            onChange={(event, newValue) => setSnsType(newValue)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '6px',
                border: '1px solid #2196f3',
                color: '#2196f3',
                gap: 2, // 요소 간 간격
                mt: 2 
              },
              '& .Mui-selected': {
                backgroundColor: '#2196f3',
                color: '#fff',
              },
            }}
          >
            <ToggleButton value="x" sx={{ minWidth: "80px" }}>X</ToggleButton>
            <ToggleButton value="Instagram" sx={{ minWidth: "100px" }}>Instagram</ToggleButton>
            <ToggleButton value="없음" sx={{ minWidth: "80px" }}>없음</ToggleButton>
          </ToggleButtonGroup>
          

          {/* 입력 필드 조건부 렌더링 */}
          {snsType !== "없음" && snsType !== "" && (
            <CustomTextField
              label={`${snsType} 계정`}
              value={snsAccount}
              onChange={(e) => setSnsAccount(e.target.value)}
              fullWidth
              required
            />
          )}
        </Box>
        <Box sx={{ marginBottom: "60px" }} /> 

        <Button fullWidth variant="contained" type="submit" sx={{ ...buttonStyle, marginTop:"20px",marginBottom: "20px" }}>
          등록하기
        </Button>
      </form>
    </Box>
  );
};

export default VenueRegister;