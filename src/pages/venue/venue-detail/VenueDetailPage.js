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
import axios from 'axios'; // axios 라이브러리

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
      const res = await axios.get(`https://eventcafe.site/user/venues/${id}/`);
      setVenue(res.data);

      const bookedRes = await axios.get(
        `https://eventcafe.site/user/bookings/reserved-dates/${id}/`
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
    <Container sx={{ py: 6, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* 왼쪽 이미지 섹션 */}
        <Box sx={{ flex: '0 0 45%' }}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
            <CardMedia
              component="img"
              image={venue.main_image_url}
              alt={venue.name}
              sx={{ 
                width: '100%',
                height: '600px',
                objectFit: 'cover'
              }}
            />
          </Card>
        </Box>

        {/* 오른쪽 정보 섹션 */}
        <Box sx={{ flex: '1 1 55%' }}>
          <Typography variant="h3" gutterBottom fontWeight={600} color="#333">
            {venue.name}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>장르</Typography>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 2,
                  backgroundColor: '#f5f5f5',
                  borderColor: '#e0e0e0',
                  color: '#333',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    borderColor: '#e0e0e0'
                  }
                }}
              >
                {venue.venue_type || '카페'}
              </Button>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>날짜</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venue.operating_hours}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>장소</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venue.road_address}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>대관료</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ₩{venue.rental_fee?.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>운영 정보</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                  {venue.operating_info}
                </Typography>
              </Box>

              {venue.sns_account && (
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>SNS</Typography>
                  <Typography variant="body1">
                    {venue.sns_account}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* 구분선 추가 */}
          <Box sx={{ 
            my: 4,
            height: '1px',
            backgroundColor: '#e0e0e0'
          }} />

          {/* 예약 섹션 */}
          <Box sx={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            p: 3,
            border: '1px solid #e0e0e0'
          }}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              mb={2}
              sx={{
                color: '#1976d2',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box component="span" sx={{ 
                width: 4,
                height: 24,
                backgroundColor: '#1976d2',
                borderRadius: 1,
                display: 'inline-block',
                mr: 1
              }}/>
              예약할 날짜를 선택하세요
            </Typography>

            <Box sx={{
              background: '#fff',
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Calendar
                onChange={setDate}
                value={date}
                selectRange={true}
                tileDisabled={({ date, view }) =>
                  view === 'month' && bookedDates.some((d) => isSameDay(d, date))
                }
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                backgroundColor: '#1976d2',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                }
              }}
              onClick={handleReserve}
              disabled={!user}
            >
              예약하고 결제하기
            </Button>
          </Box>
        </Box>
      </Box>

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
