// components/SelectStarModal.js
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';

export default function SelectStarModal({ open, onClose, onSelect }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (open) {
      axiosInstance
        .get('/user/star/stars/')
        .then((res) => setStars(res.data))
        .catch((err) => console.error('스타 목록 불러오기 실패:', err));
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'white',
          maxWidth: '800px',
          mx: 'auto',
          my: 8,
          borderRadius: 2,
          boxShadow: 6,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          최애 스타를 선택하세요
        </Typography>
        <Grid container spacing={2}>
          {stars.map((star) => (
            <Grid item xs={4} key={star.id}>
              <Card>
                <CardActionArea onClick={() => onSelect(star)}>
                  <CardMedia
                    component="img"
                    image={star.image}
                    alt={star.name}
                    sx={{ height: 140, objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography>{star.name}</Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
}
