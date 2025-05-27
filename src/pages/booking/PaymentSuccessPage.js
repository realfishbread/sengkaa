import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const dates = localStorage.getItem('booking_dates'); // ✅ 날짜 기억해뒀던 것 꺼내기

      if (!paymentKey || !orderId || !amount || !dates) {
        alert('필수 정보 누락');
        return;
      }

      try {
        console.log({
          paymentKey,
          orderId,
          amount,
          dates,
        });
        const res = await axiosInstance.post(
          '/user/bookings/payment/success/',
          {
            paymentKey,
            orderId,
            amount,
            dates: JSON.parse(dates), // 문자열을 배열로 변환
          }
        );

        alert('예약이 완료되었습니다!');
        localStorage.removeItem('booking_dates');
        navigate('/my-bookings'); // 예약 목록으로 이동하거나 원하는 경로
      } catch (err) {
        console.error(err);
        alert('예약 검증 실패!');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return <div>결제 확인 중입니다...</div>;
};

export default PaymentSuccessPage;
