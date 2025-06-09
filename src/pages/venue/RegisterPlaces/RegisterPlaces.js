import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../../components/common/CustomTextField';
import FlexInputButton from '../../../components/common/FlexInputButton';
import ImageUploader from '../../../components/common/ImageUploader';
import NoticeText from '../../../components/common/NoticeText';
import {
  boxStyle,
  buttonStyle,
  registerBox,
  titleStyle,
} from '../../../components/common/Styles';
import axiosInstance from '../../../shared/api/axiosInstance';
import LoginConfirmDialog from '../../../components/common/LoginConfirmDialog';
import { UserContext } from '../../../context/UserContext';
import './RegisterPlaces.css';

const VenueRegister = () => {
  const [venueName, setVenueName] = useState('');
  const [venueType, setVenueType] = useState(''); // 장소 타입 선택
  const [roadAddress, setRoadAddress] = useState(''); // 도로명주소
  const [detailAddress, setDetailAddress] = useState(''); // 상세주소
  const [mainImage, setMainImage] = useState(null); // 가게 메인 이미지
  const [mainImagePreview, setMainImagePreview] = useState(null); // 메인 이미지 미리보기 URL
  const [rentalFee, setRentalFee] = useState('');
  const [deposit, setDeposit] = useState('');
  const [operatingInfo, setOperatingInfo] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [benefitsImage, setBenefitsImage] = useState(null); // 특전 예시 이미지
  const [benefitsImagePreview, setBenefitsImagePreview] = useState(null); // 특전 이미지 미리보기 URL
  const [description, setDescription] = useState('');
  const [snsType, setSnsType] = useState(''); // ✅ SNS 선택 상태
  const [snsAccount, setSnsAccount] = useState(''); // ✅ SNS 계정 입력 상태
  const [askLogin, setAskLogin] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // ⬅️ ③ 추가
    if (!user) {
      // loading 끝난 뒤에만 질문
      setAskLogin(true); // 모달 오픈
    }
  }, [user, navigate]);

  // Cleanup function for image preview URLs
  useEffect(() => {
    return () => {
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
      }
      if (benefitsImagePreview) {
        URL.revokeObjectURL(benefitsImagePreview);
      }
    };
  }, [mainImagePreview, benefitsImagePreview]);

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    setImage(file); // 👉 원본 file 저장

    // 이미지 미리보기를 위한 URL 생성
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (setImage === setMainImage) {
        setMainImagePreview(imageUrl);
      } else if (setImage === setBenefitsImage) {
        setBenefitsImagePreview(imageUrl);
      }
    }
  };

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullRoadAddr = data.roadAddress; // 도로명 주소
        setRoadAddress(fullRoadAddr);
      },
    }).open();
  };

  // ✅ 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 유효성 검사는 알아서 조정!
    if (!venueName || !venueType || !roadAddress || !mainImage) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('name', venueName);
    formData.append('venue_type', venueType);
    formData.append('road_address', roadAddress);
    formData.append('detail_address', detailAddress);
    formData.append('main_image', mainImage); // 원본 file
    formData.append('rental_fee', rentalFee);
    formData.append('deposit', deposit);
    formData.append('operating_info', operatingInfo);
    formData.append('operating_hours', operatingHours);
    if (benefitsImage) {
      formData.append('benefits_image', benefitsImage);
    }
    formData.append('description', description);
    formData.append('sns_type', snsType);
    formData.append('sns_account', snsAccount);

    try {
      const token = localStorage.getItem('accessToken'); // 필요 시 토큰 사용
      const response = await axiosInstance.post(
        'https://eventcafe.site/user/venues/create/', // ✅ 실제 엔드포인트 주소로 바꿔
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // 로그인이 필요한 경우에만
          },
        }
      );

      alert('장소가 등록되었습니다!');
      console.log('✅ 등록 성공:', response.data);
      navigate('/venue-search'); // 원하는 페이지로 이동
    } catch (error) {
      console.error('❌ 등록 실패:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Box sx={boxStyle}>
        <Typography sx={titleStyle}>장소 등록</Typography>
        <Box sx={{ marginBottom: '60px' }} />

        <form onSubmit={handleSubmit}>
          <Box sx={registerBox}>
            {/* ✅ 장소명 입력 */}
            <CustomTextField
              label="장소명"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
            />

            {/* ✅ 주소 입력 & 검색 버튼 */}

            <FlexInputButton
              label="도로명 주소"
              value={roadAddress}
              buttonText="주소 찾기"
              onButtonClick={openPostcode}
              readOnly={true}
            />

            <CustomTextField
              label="상세 주소"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ marginBottom: '60px' }} />
          <Box sx={registerBox}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              장소의 타입을 선택해 주세요 (필수)
            </Typography>
            <Box className="venue-type-group">
              {['카페', '음식점', '전시회', '포토부스', '파티룸'].map(
                (type) => (
                  <button
                    key={type}
                    className={`venue-type-button ${
                      venueType === type ? 'Mui-selected' : ''
                    }`}
                    onClick={() => setVenueType(type === venueType ? '' : type)}
                  >
                    {type}
                  </button>
                )
              )}
            </Box>
          </Box>

          <Box sx={{ marginBottom: '60px' }} />
          <Box sx={registerBox}>
            {/* ✅ 가게 메인 이미지 업로드 */}
            <Typography variant="subtitle1" fontWeight="bold">
              가게 메인 이미지 (필수)
            </Typography>

            <ImageUploader
              onUpload={(event) => handleImageUpload(event, setMainImage)}
            />
            {mainImage && (
              <img
                src={mainImagePreview}
                alt="미리보기"
                style={{ width: '100px', marginTop: '10px' }}
              />
            )}
            <NoticeText text="* jpg, png만 가능합니다." />
          </Box>

          <Box sx={{ marginBottom: '60px' }} />

          {/* ✅ 대관료 & 예약금 입력 */}
          <Box sx={registerBox}>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <CustomTextField
                label="대관료 (₩)"
                value={rentalFee}
                onChange={(e) => setRentalFee(e.target.value)}
                required
              />
              <CustomTextField
                label="예약금 (₩)"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                required
              />
            </Box>

            {/* ✅ 운영 정보 입력 */}
            <CustomTextField
              label="운영 정보"
              value={operatingInfo}
              onChange={(e) => setOperatingInfo(e.target.value)}
              multiline
              rows={2}
            />

            {/* ✅ 운영 시간 입력 */}
            <CustomTextField
              label="운영 시간"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ marginBottom: '60px' }} />

          {/* ✅ 특전 이미지 업로드 */}
          <Box sx={registerBox}>
            <Typography variant="subtitle1" fontWeight="bold">
              특전 배치 혹은 예시 이미지
            </Typography>
            <ImageUploader
              onUpload={(event) => handleImageUpload(event, setBenefitsImage)}
            />
            {benefitsImage && (
              <img
                src={benefitsImagePreview}
                alt="미리보기"
                style={{ width: '100px', marginTop: '10px' }}
              />
            )}
            <NoticeText text="* jpg, png만 가능합니다." />

            {/* ✅ 소개글 입력 */}
            <CustomTextField
              label="소개글"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
            />
          </Box>

          <Box sx={{ marginBottom: '60px' }} />
          {/* ✅ SNS 선택 및 계정 입력 */}

          <Box
            sx={{
              registerBox,
              display: 'flex',
              flexDirection: 'column',
              gap: 2, // 요소 간 간격
              mt: 2,
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
                  mt: 2,
                },
                '& .Mui-selected': {
                  backgroundColor: '#2196f3',
                  color: '#fff',
                },
              }}
            >
              <ToggleButton value="x" sx={{ minWidth: '80px' }}>
                X
              </ToggleButton>
              <ToggleButton value="Instagram" sx={{ minWidth: '100px' }}>
                Instagram
              </ToggleButton>
              <ToggleButton value="없음" sx={{ minWidth: '80px' }}>
                없음
              </ToggleButton>
            </ToggleButtonGroup>

            {/* 입력 필드 조건부 렌더링 */}
            {snsType !== '없음' && snsType !== '' && (
              <CustomTextField
                label={`${snsType} 계정`}
                value={snsAccount}
                onChange={(e) => setSnsAccount(e.target.value)}
                fullWidth
                required
              />
            )}
          </Box>
          <Box sx={{ marginBottom: '60px' }} />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ ...buttonStyle, marginTop: '20px', marginBottom: '20px' }}
          >
            등록하기
          </Button>
        </form>
      </Box>

      <LoginConfirmDialog
        open={askLogin}
        onClose={() => setAskLogin(false)} // 취소
        onConfirm={
          () => navigate('/login', { state: { from: '/venue' } }) // 로그인
        }
      />
    </>
  );
};

export default VenueRegister;
