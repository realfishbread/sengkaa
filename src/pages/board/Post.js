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



          **[주의사항]**
          운영비는 장소 대관, 장식, 굿즈 제작 등 실비로만 분담해야 합니다.
          모든 활동은 비영리 팬 활동이어야 하며, 수익 목적이 있을 시 관리자 제재대상이 될 수 있습니다.
          `;

const Post = ({ onSubmitPost }) => {
  const { user } = useContext(UserContext); // ✅ 로그인 유저 정보 접근
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // 미리보기 URL
  const [imageFile, setImageFile] = useState(null); // 서버에 보낼 실제 파일
  const [title, setTitle] = useState('');

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
    formData.append('username', user?.username);
    formData.append('email', user?.email);
    formData.append('profileImage', user?.profileImage);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await CreatePost.post('/user/posts/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const createdPost = {
        title,
        content: text,
        image: image ? URL.createObjectURL(imageFile) : null,
        username: user?.username,
        profile_image: user?.profileImage,
        created_at: new Date().toISOString(),
      };

      onSubmitPost(createdPost); // ✅ 리스트에 추가되게 호출
      alert('게시글이 등록되었습니다!');
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
        <Avatar alt={user?.username} src={user?.profileImage || ''} />
        <Typography variant="subtitle2" fontWeight="bold">
          {user?.realname || user?.username || 'user'} 님
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

          [주의사항]
          참가비는 장소 대관, 장식, 굿즈 제작 등 실비로만 분담해야 합니다.
          모든 활동은 비영리 팬 활동이어야 하며, 수익 목적이 있을시 관리자 제재대상이 될 수 있습니다.
          `}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

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
