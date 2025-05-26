import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import { isSameDay } from 'date-fns'; // 날짜 비교용
import { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext'; // 사용자 정보 컨텍스트
import axiosInstance from '../../../shared/api/axiosInstance';
import TossModal from '../../toss/TossModal'; // 결제 모달 컴포넌트
import { format } from 'date-fns'; // 날짜 포맷팅용

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
    if (!date) return alert('날짜를 선택해주세요!');

    const res = await axiosInstance.post('/user/payment/create/', {
      venue_id: venue.id,
      amount: venue.deposit,
      date: format(date, 'yyyy-MM-dd'), // 🧠 예약 날짜도 꼭 보내줘야!
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
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        {venue.name}
      </Typography>
      <Card>
        <CardMedia
          component="img"
          image={venue.main_image_url}
          height="300"
          alt={venue.name}
        />
      </Card>
      <Typography mt={2}>📍 {venue.road_address}</Typography>
      <Typography>💰 ₩{venue.rental_fee.toLocaleString()}</Typography>
      <Typography>⏰ {venue.operating_hours}</Typography>
      <Typography>{venue.operating_info}</Typography>
      <Typography>{venue.sns_account}</Typography>

      <Box mt={4}>
        <Typography variant="h6">예약할 날짜를 선택하세요</Typography>
        <Calendar
          onChange={setDate}
          value={date}
          tileDisabled={({ date, view }) =>
            view === 'month' && bookedDates.some((d) => isSameDay(d, date))
          }
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
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
