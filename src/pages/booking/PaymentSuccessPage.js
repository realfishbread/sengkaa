import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccessPage.css'; // ✅ 스타일 분리해서 여기에 연결

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const verifyPayment = async () => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const dates = localStorage.getItem('booking_dates'); // ✅ 날짜 기억해뒀던 것 꺼내기
    const parsedDates = dates ? JSON.parse(dates) : [];

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
   <div className="payment-success-container">
      <h2 className="payment-success-title">결제 요청이 완료되었습니다!</h2>
      <p className="payment-success-subtitle">토스 결제 승인 버튼을 눌러주세요 :)</p>


      <div className="payment-button-section">
        {!isSuccess ? (
          <button
            className="payment-button"
            onClick={verifyPayment}
            disabled={isLoading}
          >
            {isLoading ? '승인 중...' : '결제 승인하기'}
          </button>
        ) : (
          <p className="payment-complete-message">🎉 결제가 완료되었습니다 🎉</p>
        )}
      </div>

       <div className="payment-info">
        <p><strong>결제 금액:</strong> {searchParams.get('amount')}원</p>
        <p><strong>주문번호:</strong> {searchParams.get('orderId')}</p>
        <p><strong>PaymentKey:</strong> {searchParams.get('paymentKey')}</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
