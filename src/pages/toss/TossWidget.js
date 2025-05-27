import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect } from 'react';

const TossWidget = ({ clientKey, orderId, orderName, amount, user }) => {
  useEffect(() => {
    const initToss = async () => {
      const tossPayments = await loadTossPayments(clientKey);

      const widgets = tossPayments.widgets({
        customerKey: String(user.id), // ⚠️ 반드시 랜덤하지 않은 유저 식별자 사용
      });

      await widgets.setAmount({
        value: amount,
        currency: 'KRW',
      });

      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT', // or 너가 만든 커스텀 키
      });

      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });

      const bookingDates = sessionStorage.getItem('booking_dates');

      document
        .getElementById('payment-button')
        .addEventListener('click', async () => {
          try {
            await widgets.requestPayment({
              orderId,
              orderName,
              customerName: user.username || '익명 유저',
              customerEmail: user.email || '',
              successUrl: `${
                window.location.origin
              }/user/bookings/payment/success/page/?dates=${encodeURIComponent(
                bookingDates
              )}`,
              failUrl: `${window.location.origin}/user/bookings/payment/fail/`,
            });
          } catch (error) {
            console.error('결제 위젯 오류:', error);
          }
        });
    };

    initToss();
  }, [clientKey, orderId, orderName, amount, user]);

  return (
    <div>
      <div id="payment-method" />
      <div id="agreement" />
      <button id="payment-button">결제하기</button>
    </div>
  );
};

export default TossWidget;
