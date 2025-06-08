// components/common/LoadingScreen.js
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ message = '로딩 중입니다...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: 2,
    }}
  >
    <CircularProgress />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default LoadingScreen;
