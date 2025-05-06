import ImageIcon from '@mui/icons-material/Image';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WarningBox from '../../components/common/WarningBox';
import { UserContext } from '../../context/UserContext'; // ✅ 경로는 실제 프로젝트 구조에 맞게 조정
import { CreatePost } from './api/CreatePost';

const defaultTemplate = `[팬이벤트 공동 주최자 모집 내용 예시]

          이벤트 대상 :
          
          이벤트 형태 : 
          
          예상 주최 일정(횟수) :
          
          예상 준비 기간 :
          
          모집인원 :
          
          소개와 개설 이유 :
          
          주최 관련 주의사항 :
          
          공동주최에 지원할 수 있는 방법을 남겨주세요. 
          : (이메일, 카카오 오픈채팅방, 구글폼 등)


          `;

const Post = ({ onSubmitPost, onRefresh }) => {
  const { user } = useContext(UserContext); // ✅ 로그인 유저 정보 접근
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // 미리보기 URL
  const [imageFile, setImageFile] = useState(null); // 서버에 보낼 실제 파일
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  // ✅ 처음 로드될 때 기본 템플릿 세팅
  useEffect(() => {
    setText(defaultTemplate);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 미리보기
      setImageFile(file); // 실제 전송용
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !text.trim()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', text);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await CreatePost(formData);

      const createdPost = {
        title,
        content: text,
        image: image ? URL.createObjectURL(imageFile) : null,
        nickname: user?.nickname,
        profile_image: user?.profileImage,
        created_at: new Date().toISOString(),
      };

      onSubmitPost && onSubmitPost(createdPost); // ✅ 리스트에 추가
      onRefresh && onRefresh('all'); // ✅ 게시글 목록 갱신
      alert('게시글이 등록되었습니다!');
      navigate('/board'); // ✅ 게시판으로 이동
      setTitle('');
      setText(defaultTemplate);
      setImage(null);
      setImageFile(null);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드에 실패했습니다 😢');
    }
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
        placeholder="예시: OOO 생일카페 같이 준비하실 분!"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
        sx={{ mb: 0.5 }}
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={20}
        placeholder={`[팬이벤트 공동 주최자 모집 내용 예시]

          이벤트 대상 :
          
          이벤트 형태 : 
          
          예상 주최 일정(횟수) :
          
          예상 준비 기간 :
          
          모집인원 :
          
          소개와 개설 이유 :
          
          주최 관련 주의사항 :
          
          공동주최에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방, 구글폼 등) :

          `}
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
              maxWidth: '300px', // 💡 너무 크지 않게 조절
              maxHeight: '300px',
              borderRadius: 8,
              objectFit: 'cover', // ✨ 이미지가 비율 유지하면서 잘려도 예쁘게
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
        <Button variant="contained" onClick={handlePost}>
          모집글 등록
        </Button>
      </Box>
    </Paper>
  );
};

export default Post;
