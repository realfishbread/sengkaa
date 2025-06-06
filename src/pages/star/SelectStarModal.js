// 최애 구독
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../shared/api/axiosInstance';

const SelectStarModal = ({ open, onClose, onSelect }) => {
  const [stars, setStars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      axiosInstance
        .get('/user/star/stars/')
        .then((res) => setStars(res.data))
        .catch((err) => console.error('스타 목록 불러오기 실패:', err));
    }
  }, [open]);

  const filteredStars = stars.filter(star => 
    star.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="select-star-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%' },
          maxWidth: '1200px',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.3)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            최애 스타를 선택하세요
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="스타 이름으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(0,0,0,0.03)',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2} justifyContent="flex-start">
          {filteredStars.map((star) => (
            <Grid item xs={3} sm={2} md={1.5} key={star.id}>
              <Box
                onClick={() => onSelect(star)}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    '& .overlay': {
                      opacity: 1,
                    },
                    '& .star-name': {
                      transform: 'translateY(0)',
                      opacity: 1,
                    }
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${star.image})`,
                    backgroundSize: '115% auto',
                    backgroundPosition: 'center 25%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    className="star-name"
                    variant="h6"
                    sx={{
                      color: 'white',
                      textAlign: 'center',
                      transform: 'translateY(20px)',
                      opacity: 0,
                      transition: 'all 0.3s ease',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {star.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default SelectStarModal;
