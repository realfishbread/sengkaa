// pages/MyBookingsPage.js
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axiosInstance from '../../../shared/api/axiosInstance';
  
  const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
  
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const res = await axiosInstance.get('/user/bookings/my-venues/');
          setBookings(res.data);
        } catch (err) {
          console.error('❌ 예약 목록 불러오기 실패:', err);
        }
      };
      fetchBookings();
    }, []);
  
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          내 예약 목록
        </Typography>
  
        {bookings.length === 0 ? (
          <Typography color="text.secondary">예약한 대관 장소가 없습니다.</Typography>
        ) : (
          bookings.map((booking, idx) => (
            <Card key={idx} sx={{ display: 'flex', mb: 3 }}>
              {booking.venue.image && (
                <CardMedia
                  component="img"
                  image={booking.venue.image}
                  alt={booking.venue.name}
                  sx={{ width: 180 }}
                />
              )}
              <CardContent>
                <Typography variant="h6">{booking.venue.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {booking.venue.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  💰 {booking.venue.rental_fee.toLocaleString()}원
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📅 예약 날짜: {booking.available_date}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    );
  };
  
  export default MyBookingsPage;
  