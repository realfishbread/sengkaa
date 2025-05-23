import {
    Box,
    Button,
    Card,
    CardMedia,
    Container,
    Typography,
  } from '@mui/material';
  import { useParams } from 'react-router-dom';
  import { useEffect, useState } from 'react';
  import axiosInstance from '../../../shared/api/axiosInstance';
  import Calendar from 'react-calendar';
  import 'react-calendar/dist/Calendar.css';
  import dayjs from 'dayjs';
  
  const VenueDetailPage = () => {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [date, setDate] = useState(null);
  
    useEffect(() => {
      const fetchVenue = async () => {
        const res = await axiosInstance.get(`/user/venues/${id}/`);
        setVenue(res.data);
      };
      fetchVenue();
    }, [id]);
  
    const handleReserve = async () => {
      if (!date) return alert('날짜를 선택해주세요!');
      const res = await axiosInstance.post('/user/payment/create/', {
        venue_id: venue.id,
        amount: venue.rental_fee,
      });
  
      const toss = await import('@tosspayments/payment-sdk').then(m => m.loadTossPayments(res.data.clientKey));
      toss.requestPayment('카드', {
        amount: res.data.amount,
        orderId: res.data.orderId,
        orderName: venue.name,
        customerName: venue.user?.nickname || '사용자',
        successUrl: `https://eventcafe.site/payment/success/?venue_id=${venue.id}&date=${dayjs(date).format('YYYY-MM-DD')}`,
        failUrl: `https://eventcafe.site/payment/fail/`,
      });
    };
  
    if (!venue) return null;
  
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>{venue.name}</Typography>
        <Card>
          <CardMedia
            component="img"
            image={venue.main_image_url}
            height="300"
            alt={venue.name}
          />
        </Card>
        <Typography mt={2}>📍 {venue.road_address} {venue.detail_address}</Typography>
        <Typography>💰 ₩{venue.rental_fee.toLocaleString()}</Typography>
        <Typography>⏰ {venue.operating_hours}</Typography>
  
        <Box mt={4}>
          <Typography variant="h6">예약할 날짜를 선택하세요</Typography>
          <Calendar onChange={setDate} value={date} />
        </Box>
  
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleReserve}>
          예약하고 결제하기
        </Button>
      </Container>
    );
  };
  
  export default VenueDetailPage;
  