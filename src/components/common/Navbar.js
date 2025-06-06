import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Autocomplete,
  TextField,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(null);

  // 임시 아티스트 데이터 (실제로는 API에서 가져와야 함)
  const artists = [
    { id: 1, name: '김나경', group: '트레저스', image: '/path/to/image1.jpg' },
    { id: 2, name: '이지은', group: '아이유', image: '/path/to/image2.jpg' },
    // ... 더 많은 아티스트
  ];

  const handleSearchChange = (event, newValue) => {
    setSearchValue(newValue);
    if (newValue) {
      navigate(`/artist/${newValue.id}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              fontWeight: 700,
              color: 'black',
              textDecoration: 'none',
            }}
          >
            SENGKAA
          </Typography>

          <Box sx={{ flexGrow: 1, mx: 4, maxWidth: 400 }}>
            <Autocomplete
              options={artists}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={option.image} sx={{ width: 30, height: 30 }} />
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.group}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="찾으시는 최애가 있으신가요?"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: '#f5f5f5',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff3d81',
                      },
                    },
                  }}
                />
              )}
              value={searchValue}
              onChange={handleSearchChange}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                color: '#ff3d81',
                borderColor: '#ff3d81',
                '&:hover': {
                  borderColor: '#ff2772',
                  backgroundColor: 'rgba(255, 61, 129, 0.04)',
                },
              }}
            >
              로그인
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff3d81',
                '&:hover': {
                  backgroundColor: '#ff2772',
                },
              }}
            >
              회원가입
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 