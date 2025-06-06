import { Box, Typography, Paper } from '@mui/material';

const Reply = ({ data, isChild = false }) => {
  return (
    <Paper
      elevation={isChild ? 2 : 1}
      sx={{
        ml: isChild ? 4 : 0,
        mt: 1,
        p: 2,
        backgroundColor: isChild ? '#f0f4ff' : '#ffffff', // 자식이면 연파랑
        borderLeft: isChild ? '4px solid #1976d2' : '2px solid #ccc', // 더 진하게 구분
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" color="primary">
        {data.user.nickname}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {data.content}
      </Typography>
    </Paper>
  );
};

export default Reply;
