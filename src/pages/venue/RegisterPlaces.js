import React, { useState } from "react";
import { TextField, Button, Box, Typography, ToggleButton, ToggleButtonGroup, toggleButtonGroupClasses } from "@mui/material";
import ImageUploader from "../../components/common/ImageUploader";
import NoticeText from "../../components/common/NoticeText";
import CustomTextField from "../../components/common/CustomTextField";
import { boxStyle, buttonStyle, inputFieldStyle, titleStyle, toggleButtonGroupStyle } from "../../components/common/Styles";


const VenueRegister = () => {
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [venueType, setVenueType] = useState(""); // 장소 타입 선택
  const [region, setRegion] = useState(""); // 지역 선택
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

      <form onSubmit={handleSubmit}>
        {/* ✅ 장소명 입력 */}
        <CustomTextField label="장소명" value={venueName} onChange={(e) => setVenueName(e.target.value)} required />

         {/* ✅ 지역 선택 */}
         <CustomTextField label="지역" value={region} onChange={(e) => setRegion(e.target.value)} required />
       
        {/* ✅ 주소 입력 & 검색 버튼 */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          <CustomTextField label="주소" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Button variant="outlined" onClick={() => alert("주소 검색 API 연결 예정!")}>주소 찾기</Button>
        </Box>

        {/* ✅ 장소 타입 선택 */}
        <Typography variant="subtitle1" fontWeight="bold" marginTop={8} marginBottom={3}>장소의 타입을 선택해 주세요 (필수)</Typography>
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


        {/* ✅ 가게 메인 이미지 업로드 */}
        <Typography variant="subtitle1" fontWeight="bold" marginTop={8} >가게 메인 이미지 (필수)</Typography>
        <ImageUploader onUpload={(event) => handleImageUpload(event, setMainImage)} />
        {mainImage && <img src={mainImage} alt="미리보기" style={{ width: "100px", marginTop: "10px" }} />}
        <NoticeText text="* jpg, png만 가능합니다." />

        {/* ✅ 대관료 & 예약금 입력 */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          <CustomTextField label="대관료 (₩)" value={rentalFee} onChange={(e) => setRentalFee(e.target.value)} required />
          <CustomTextField label="예약금 (₩)" value={deposit} onChange={(e) => setDeposit(e.target.value)} required />
        </Box>

        {/* ✅ 운영 정보 입력 */}
        <CustomTextField label="운영 정보" value={operatingInfo} onChange={(e) => setOperatingInfo(e.target.value)} multiline rows={2} />

        {/* ✅ 운영 시간 입력 */}
        <CustomTextField label="운영 시간" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} required />

        {/* ✅ 특전 이미지 업로드 */}
        <Typography variant="subtitle1" fontWeight="bold" marginTop={8}>특전 배치 혹은 예시 이미지</Typography>
        <ImageUploader onUpload={(event) => handleImageUpload(event, setBenefitsImage)} />
        {benefitsImage && <img src={benefitsImage} alt="미리보기" style={{ width: "100px", marginTop: "10px" }} />}
        <NoticeText text="* jpg, png만 가능합니다." />

        {/* ✅ 소개글 입력 */}
        <CustomTextField label="소개글" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} />
        
         {/* ✅ SNS 선택 및 계정 입력 */}
         <Typography variant="subtitle1" fontWeight="bold" marginTop={8}>SNS 아이디</Typography>
        <ToggleButtonGroup
          value={snsType}
          exclusive
          onChange={(event, newValue) => setSnsType(newValue)}
          className="sns-button"
        >
          <ToggleButton value="x">x</ToggleButton>
          <ToggleButton value="Instagram">Instagram</ToggleButton>
          <ToggleButton value="없음">없음</ToggleButton>
        </ToggleButtonGroup>

        {/* ✅ SNS 입력 필드 (X 또는 Instagram 선택 시 활성화) */}
        {snsType !== "없음" && snsType !== "" && (
          <CustomTextField
            label={`${snsType} 계정`}
            value={snsAccount}
            onChange={(e) => setSnsAccount(e.target.value)}
            required
          />
        )}

        <Button fullWidth variant="contained" type="submit" sx={{ ...buttonStyle, marginTop:"20px",marginBottom: "20px" }}>
          등록하기
        </Button>
      </form>
    </Box>
  );
};

export default VenueRegister;
