import ImageIcon from '@mui/icons-material/Image';
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WarningBox from '../../components/common/WarningBox';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';

const EditPost = () => {
  const { user } = useContext(UserContext);
  const { postId } = useParams(); // 주소에서 postId 가져오기
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // 미리보기
  const [imageFile, setImageFile] = useState(null); // 업로드용
  const [isOpen, setIsOpen] = useState(true); // 모집 상태 추가

  useEffect(() => {
    // 🔁 기존 글 데이터 불러오기
    axiosInstance
      .get(`/user/posts/${postId}/`)
      .then((res) => {
        setTitle(res.data.title);
        setText(res.data.content);
        if (res.data.image) {
          setImage(res.data.image); // 기본 이미지 미리보기
        }
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러올 수 없습니다.');
      });
  }, [postId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 미리보기
      setImageFile(file); // 전송용
    }
  };

  const handleUpdate = () => {
    if (!title.trim() || !text.trim()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', text);
    if (imageFile) {
      formData.append('image', imageFile); // 새 이미지 있을 경우만
    }

    axiosInstance
      .patch(`/user/posts/${postId}/`, formData)
      .then(() => {
        alert('게시글이 수정되었습니다!');
        navigate('/board');
      })
      .catch((err) => {
        console.error('수정 실패:', err);
        alert('게시글 수정에 실패했습니다.');
      });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 700,
        mx: 'auto',
        my: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: '#fefefe',
        border: '1px solid #e0e0e0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar alt={user?.nickname} src={user?.profileImage || ''} />
        <Typography variant="subtitle2" fontWeight="bold">
          {user?.nickname || user?.username || 'user'} 님
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="제목"
        InputLabelProps={{ shrink: true }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
        sx={{ mb: 0.5 }}
      />

      <Divider sx={{ my: 2 }} />

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="recruit-status-label">모집 상태</InputLabel>
        <Select
          labelId="recruit-status-label"
          value={isOpen}
          label="모집 상태"
          onChange={(e) => setIsOpen(e.target.value)}
        >
          <MenuItem value={true}>모집 중</MenuItem>
          <MenuItem value={false}>모집 완료</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={20}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <WarningBox />

      {image && (
        <Box mt={2} sx={{ textAlign: 'center' }}>
          <img
            src={image}
            alt="preview"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              borderRadius: 8,
              objectFit: 'cover',
            }}
          />
        </Box>
      )}

      <Box
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton component="label">
          <ImageIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </IconButton>
        <Button variant="contained" onClick={handleUpdate}>
          게시글 수정
        </Button>
      </Box>
    </Paper>
  );
};

export default EditPost;
