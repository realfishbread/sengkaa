import Modal from '@mui/material/Modal';
import TossWidget from './TossWidget';

const TossModal = ({ open, onClose, clientKey, orderId, orderName, amount, user }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8 }}>
        <TossWidget
          clientKey={clientKey}
          orderId={orderId}
          orderName={orderName}
          amount={amount}
          user={user}
        />
        <button onClick={onClose}>닫기</button>
      </div>
    </Modal>
  );
};

export default TossModal;
