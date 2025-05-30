import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const rawDates = searchParams.get('dates');
    const parsedDates = rawDates
      ? JSON.parse(decodeURIComponent(rawDates))
      : [];

    const verifyPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount || parsedDates.length === 0) {
        alert('필수 정보 누락');
        return;
      }

      try {
        await axios.post(
          'https://eventcafe.site/user/bookings/payment/success/',
          {
            paymentKey,
            orderId,
            amount,
            dates: parsedDates,
          }
        );

        alert('예약이 완료되었습니다!');
        navigate('/my-bookings');
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
