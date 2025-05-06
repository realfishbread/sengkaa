import {
  Box,
  Button,
  createFilterOptions,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import CustomTextField from '../../components/common/CustomTextField';
import FlexInputButton from '../../components/common/FlexInputButton';
import ImageUploader from '../../components/common/ImageUploader';
import NoticeText from '../../components/common/NoticeText';
import {
  boxStyle,
  buttonStyle,
  registerBox,
  titleStyle,
} from '../../components/common/Styles';
import axiosInstance from '../../shared/api/axiosInstance';

const BirthdayCafeRegister = () => {
  const [cafeName, setCafeName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [selectedStar, setSelectedStar] = useState('');

  const [genre, setGenre] = useState('idol'); // 유저가 선택한 장르
  const [starList, setStarList] = useState([]); // 선택된 장르의 리스트만 담김

  const [roadAddress, setRoadAddress] = useState(''); // 도로명주소
  const [detailAddress, setDetailAddress] = useState(''); // 상세주소

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [goodsList, setGoodsList] = useState([
    {
      name: '',
      description: '',
      price: '',
      image: null,
    },
  ]);

  useEffect(() => {
    fetch(`/data/${genre}.json`)
      .then((res) => res.json())
      .then((data) => {
        setStarList(data); // ⭐ Autocomplete에 들어갈 options
      })
      .catch((err) => {
        console.error('로딩 실패 ❌', err);
        setStarList([]);
      });
  }, [genre]);

  const filter = createFilterOptions({
    stringify: (option) =>
      [
        option.display,
        option.name,
        option.group,
        ...(option.keywords || []),
      ].join(' '),
  });

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullRoadAddr = data.roadAddress; // 도로명 주소
        setRoadAddress(fullRoadAddr);
      },
    }).open();
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('cafe_name', cafeName);
    formData.append('description', description);
    formData.append('road_address', roadAddress);
    formData.append('detail_address', detailAddress);
    formData.append('start_date', startDate?.toISOString().slice(0, 10));
    formData.append('end_date', endDate?.toISOString().slice(0, 10));
    formData.append('genre', genre);
    formData.append('star', selectedStar?.name || '');

    if (image) {
      formData.append('main_image', image); // 너가 쓰는 키에 맞게 수정
    }

    goodsList.forEach((goods, index) => {
      formData.append(`goods[${index}][name]`, goods.name);
      formData.append(`goods[${index}][description]`, goods.description);
      formData.append(`goods[${index}][price]`, goods.price);
      if (goods.image) {
        formData.append(`goods[${index}][image]`, goods.image);
      }
    });

    try {
      const response = await axiosInstance.post(
        '/user/events/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('이벤트가 등록되었습니다!');
      Navigate('/'); // 등록 후 홈으로 이동
    } catch (err) {
      console.error('등록 실패 ❌', err);
      alert('등록에 실패했습니다.');
    }
  };

  const addGoods = () => {
    setGoodsList([
      ...goodsList,
      { name: '', description: '', price: '', image: null },
    ]);
  };

  const removeGoods = (index) => {
    const updated = [...goodsList];
    updated.splice(index, 1);
    setGoodsList(updated);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={boxStyle}>
        <Typography sx={titleStyle}>이벤트 등록</Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px', // 각 항목 간 여백
          }}
        >
          <Divider sx={{ my: 4 }}>기본 정보</Divider>
          <Box sx={registerBox}>
            <CustomTextField
              label="이벤트 이름"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
            />
            <NoticeText text="* 이벤트 이름은 정확한 정보와 함께 기재해 주세요." />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                  },
                }}
              />
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                  },
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }}>장르 및 대상 선택</Divider>

          <Box sx={registerBox}>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {['idol', 'youtuber', 'comic', 'webtoon', 'game'].map((g) => (
                <Button
                  key={g}
                  variant={genre === g ? 'contained' : 'outlined'}
                  onClick={() => setGenre(g)}
                >
                  {
                    {
                      idol: '아이돌',
                      youtuber: '유튜버',
                      comic: '만화',
                      webtoon: '웹툰',
                      game: '게임',
                    }[g]
                  }
                </Button>
              ))}
            </Box>

            {/* ✅ 스타 선택란 추가 */}
            <Autocomplete
              options={starList} // ⭐ 장르에 따라 바뀜
              getOptionLabel={(option) => (option && option.display) || ''}
              filterOptions={filter}
              onChange={(event, newValue) => {
                setSelectedStar(newValue); // ⭐ 유튜버든 아이돌이든 저장 가능
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`${genre} 검색`}
                  margin="normal"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    },
                  }}
                />
              )}
            />

            {selectedStar && selectedStar.image && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <img
                  src={selectedStar.image}
                  alt={selectedStar.display}
                  style={{
                    width: '160px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'; // 이미지 없으면 안보이게
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {selectedStar.display}
                </Typography>
              </Box>
            )}
            <NoticeText text="* 해당 이벤트와 관련된 스타를 선택해 주세요." />
          </Box>

          <Divider sx={{ my: 4 }}>주소 입력</Divider>

          <Box sx={registerBox}>
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

          <Divider sx={{ my: 4 }}>굿즈 정보</Divider>

          {goodsList.map((goods, index) => (
            <Box key={index} sx={registerBox}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                굿즈 {index + 1}
              </Typography>

              <CustomTextField
                label="굿즈 이름"
                value={goods.name}
                onChange={(e) => {
                  const updated = [...goodsList];
                  updated[index].name = e.target.value;
                  setGoodsList(updated);
                }}
              />

              <CustomTextField
                label="굿즈 설명"
                value={goods.description}
                onChange={(e) => {
                  const updated = [...goodsList];
                  updated[index].description = e.target.value;
                  setGoodsList(updated);
                }}
                multiline
                rows={3}
              />

              <ImageUploader
                onUpload={(e) => {
                  const updated = [...goodsList];
                  updated[index].image = e.target.files[0];
                  setGoodsList(updated);
                }}
              />
              <NoticeText text="* 굿즈 이미지(jpg, png) 업로드" />

              <CustomTextField
                label="가격 (원)"
                type="number"
                value={goods.price}
                onChange={(e) => {
                  const updated = [...goodsList];
                  updated[index].price = e.target.value;
                  setGoodsList(updated);
                }}
              />

              <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                  onClick={() => removeGoods(index)}
                  color="error"
                  variant="text"
                  size="small"
                >
                  삭제
                </Button>
              </Box>
            </Box>
          ))}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={addGoods}
              sx={{
                borderRadius: '8px',
                padding: '10px 24px',
                fontWeight: 600,
              }}
            >
              + 굿즈 추가하기
            </Button>
          </Box>
          <Divider sx={{ my: 4 }}>카페 진행 설명</Divider>

          <Box sx={registerBox}>
            <CustomTextField
              label="설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />
            <ImageUploader onUpload={handleImageUpload} />
            <NoticeText text="* jpg, png만 가능합니다." />
          </Box>
          <Button fullWidth variant="contained" type="submit" sx={buttonStyle}>
            등록하기
          </Button>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default BirthdayCafeRegister;
