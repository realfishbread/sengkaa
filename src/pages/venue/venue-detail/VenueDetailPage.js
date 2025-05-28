import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import { format, isSameDay } from 'date-fns'; // 날짜 비교용
import { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext'; // 사용자 정보 컨텍스트
import axiosInstance from '../../../shared/api/axiosInstance';
import TossModal from '../../toss/TossModal'; // 결제 모달 컴포넌트

const VenueDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [venue, setVenue] = useState(null);
  const [date, setDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); // 예약된 날짜
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      const res = await axiosInstance.get(`/user/venues/${id}/`);
      setVenue(res.data);

      const bookedRes = await axiosInstance.get(
        `/user/bookings/reserved-dates/${id}/`
      );
      setBookedDates(bookedRes.data.map((dateStr) => new Date(dateStr))); // 날짜 문자열 → Date 객체로
    };
    fetchVenue();
  }, [id]);

  const handleReserve = async () => {
    if (!date || !Array.isArray(date))
      return alert('날짜 범위를 선택해주세요!');

    const [startDate, endDate] = date;
    const formattedStart = format(startDate, 'yyyy-MM-dd');
    const formattedEnd = format(endDate, 'yyyy-MM-dd');

    sessionStorage.setItem(
      'booking_dates',
      JSON.stringify([formattedStart, formattedEnd]) // 👉 문자열 배열로 저장
    );

    const res = await axiosInstance.post('/user/bookings/payment/create/', {
      venue_id: venue.id,
      amount: venue.deposit,
      start_date: formattedStart,
      end_date: formattedEnd,
    });

    setPaymentInfo({
      clientKey: res.data.clientKey,
      orderId: res.data.orderId,
      amount: res.data.amount,
      orderName: venue.name,
    });
    setModalOpen(true); // 모달 오픈
  };

  if (!venue) return null;

  return (
    <Container sx={{ py: 6, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="#333">
        {venue.name}
      </Typography>

      <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <CardMedia
          component="img"
          image={venue.main_image_url}
          height="300"
          alt={venue.name}
          sx={{ objectFit: 'cover' }}
        />
      </Card>

      <Box mt={3} sx={{ color: '#555', fontSize: 16 }}>
        <Typography mt={1}>📍 {venue.road_address}</Typography>
        <Typography>💰 ₩{venue.rental_fee.toLocaleString()}</Typography>
        <Typography>⏰ {venue.operating_hours}</Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{venue.operating_info}</Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{venue.sns_account}</Typography>
      </Box>

      <Box mt={5} sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={500} mb={2}>
          예약할 날짜를 선택하세요
        </Typography>

        <Box
          sx={{
            background: '#fafafa',
            borderRadius: 2,
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
            p: 2,
          }}
        >
          <Calendar
            onChange={setDate}
            value={date}
            selectRange={true}
            tileDisabled={({ date, view }) =>
              view === 'month' && bookedDates.some((d) => isSameDay(d, date))
            }
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 4,
          backgroundColor: '#6C63FF',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 16,
          '&:hover': {
            backgroundColor: '#574de3',
          },
        }}
        onClick={handleReserve}
        disabled={!user}
      >
        예약하고 결제하기
      </Button>

      {paymentInfo && (
        <TossModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          clientKey={paymentInfo.clientKey}
          orderId={paymentInfo.orderId}
          orderName={paymentInfo.orderName}
          amount={paymentInfo.amount}
          user={user}
        />
      )}
    </Container>
  );
};

export default VenueDetailPage;
