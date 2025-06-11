import { Box } from '@mui/material';

const Spacer = ({ size = 4 }) => (
  <Box sx={{ mt: `${8 * size}px !important` }} />
);

export default Spacer;
