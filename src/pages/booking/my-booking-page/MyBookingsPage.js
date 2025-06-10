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
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../shared/api/axiosInstance';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const groupConsecutiveDates = (dates) => {
  if (!Array.isArray(dates)) return [];

  // 날짜 정렬
  const sorted = [...dates].sort();
  const result = [];
  let temp = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      temp.push(sorted[i]);
    } else {
      result.push([...temp]);
      temp = [sorted[i]];
    }
  }
  result.push(temp); // 마지막 그룹 추가
  return result;
};

const formatDateRange = (group) =>
  group.length === 1 ? group[0] : `${group[0]} ~ ${group[group.length - 1]}`;

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
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        내 예약 목록
      </Typography>

      {bookings.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          예약한 대관 장소가 없습니다.
        </Typography>
      ) : (
        bookings.map((booking, idx) => (
          <Card
            key={idx}
            sx={{
              display: 'flex',
              mb: 3,
              borderRadius: 2,
              boxShadow: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.3s',
              flexDirection: { xs: 'column', sm: 'row' },
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            {booking.venue.image && (
              <CardMedia
                component="img"
                image={booking.venue.image}
                alt={booking.venue.name}
                sx={{
                  width: { xs: '100%', sm: 180 },
                  height: { xs: 180, sm: 'auto' },
                  objectFit: 'cover',
                }}
              />
            )}
            <CardContent
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {booking.venue.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  📍 {booking.venue.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  💰 {booking.venue.rental_fee.toLocaleString()}원
                </Typography>
                <Typography variant="body2" mt={1}>
                  📅 예약 날짜: <strong>{booking.available_date}</strong>
                </Typography>
              </Box>

              <Box mt={2}>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: 'fit-content',
                  }}
                  onClick={() => {
                    alert(
                      `📝 상세 페이지는 아직 준비 중이에요!\n\n예약 장소: ${booking.venue.name}`
                    );
                    // 또는 콘솔로 보기
                    // console.log('예약 정보:', booking);
                  }}
                >
                  예약 상세보기
                </button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MyBookingsPage;
