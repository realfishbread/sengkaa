import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import axiosInstance from '../../shared/api/axiosInstance';

const ReportModal = ({ postId, onClose }) => {
  const [reportContent, setReportContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reportContent.trim()) {
      alert('신고 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post('/user/reports/', {
        post: postId,
        content: reportContent,
      });
      alert('신고가 접수되었습니다.');
      onClose();
    } catch (error) {
      console.error('신고 실패:', error);
      alert('신고에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          게시글 신고
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="신고 사유를 입력해주세요."
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            신고
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReportModal;