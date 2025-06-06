import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SelectStarModal = ({ open, onClose, onSelect }) => {
  const stars = [
    { id: 1, name: '미연', image: 'https://i.imgur.com/example1.jpg' },
    { id: 2, name: '민니', image: 'https://i.imgur.com/example2.jpg' },
    { id: 3, name: '전소연', image: 'https://i.imgur.com/example3.jpg' },
    { id: 4, name: '수진', image: 'https://i.imgur.com/example4.jpg' },
    { id: 5, name: '슈화', image: 'https://i.imgur.com/example5.jpg' },
    { id: 6, name: '우기', image: 'https://i.imgur.com/example6.jpg' },
  ];

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
          width: { xs: '90%', sm: '80%', md: '70%' },
          maxWidth: '900px',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
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

        <Grid container spacing={4} justifyContent="center">
          {stars.map((star) => (
            <Grid item xs={6} sm={4} md={4} key={star.id}>
              <Box
                onClick={() => onSelect(star)}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%', // 1:1 비율 유지
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
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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