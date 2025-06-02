import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TossWidget from './TossWidget';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 480,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const TossModal = ({
  open,
  onClose,
  clientKey,
  orderId,
  orderName,
  amount,
  user,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <TossWidget
          clientKey={clientKey}
          orderId={orderId}
          orderName={orderName}
          amount={amount}
          user={user}
        />
        <Button variant="outlined" color="secondary" onClick={onClose}>
          닫기
        </Button>
      </Box>
    </Modal>
  );
};

export default TossModal;
