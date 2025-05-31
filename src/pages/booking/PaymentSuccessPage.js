import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const dates = localStorage.getItem('booking_dates'); // ✅ 날짜 기억해뒀던 것 꺼내기

    if (!paymentKey || !orderId || !amount || parsedDates.length === 0) {
      alert('필수 정보 누락');
      return;
    }

    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');

    try {
      await axios.post(
        'https://eventcafe.site/user/bookings/payment/success/',
        {
          paymentKey,
          orderId,
          amount,
          dates: parsedDates,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ 반드시 넣기
          },
        }
      );

      setIsSuccess(true);
      alert('예약이 완료되었습니다!');
      navigate('/my-bookings');
    } catch (err) {
      console.error(err);
      alert('예약 검증 실패!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>결제 요청까지 성공했어요.</h2>
      <p>결제 승인하고 완료해보세요.</p>

      <div style={{ marginTop: '2rem' }}>
        {!isSuccess ? (
          <button onClick={handleConfirmPayment} disabled={isLoading}>
            {isLoading ? '승인 중...' : '결제 승인하기'}
          </button>
        ) : (
          <p>결제가 완료되었습니다 🎉</p>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <p>
          <strong>결제 금액:</strong> {searchParams.get('amount')}원
        </p>
        <p>
          <strong>주문번호:</strong> {searchParams.get('orderId')}
        </p>
        <p>
          <strong>PaymentKey:</strong> {searchParams.get('paymentKey')}
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
