import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';
import LoginConfirmDialog from '../../components/common/LoginConfirmDialog';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(2),
  height: 'calc(100vh - 180px)',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  backgroundColor: isUser ? theme.palette.primary.light : '#ffffff',
  color: isUser ? '#fff' : theme.palette.text.primary,
  padding: theme.spacing(1.5),
  borderRadius: '16px',
  maxWidth: '80%',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  position: 'relative',
}));

const ChatPage = ({ profile_image }) => {
  const { user, ready } = useContext(UserContext); // ✅ 여기 추가
  const [askLogin, setAskLogin] = useState(false);
  const nickname = user?.nickname || '사용자'; // ✅ 그리고 여기서 username 정의
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { roomId } = useParams(); // ✅ 필수!
  const navigate = useNavigate(); // ✅ 여기 추가

  useEffect(() => {
    // ⬅️ ③ 추가
    if (!user) {
      // loading 끝난 뒤에만 질문
      setAskLogin(true); // 모달 오픈
    }
  }, [user, navigate]);

  const ws = useRef(null);
  const scrollRef = useRef(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/rooms/${roomId}/messages/`);
        setMessages(res.data);
      } catch (err) {
        console.error('메시지 불러오기 실패', err);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const res = await axiosInstance.get(`/chat/rooms/${roomId}/`);
        console.log(res.data); // name, participants 등!
      } catch (err) {
        console.error('방 정보 불러오기 실패', err);
      }
    };

    fetchRoomDetail();
  }, [roomId]);

  useEffect(() => {
    ws.current = new WebSocket(
      `wss://eventcafe.site/ws/chat/${roomId}/?token=${token}`
    );

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        // 데이터가 배열인지 먼저 체크!
        if (data.type === 'initial_messages' && Array.isArray(data.messages)) {
          const normalized = data.messages.map((m) => ({
            message: m.content,
            nickname: m.sender,
            timestamp: m.timestamp,
            is_system: m.is_system,
          }));
          setMessages(normalized);
        } else if (data.message && data.sender) {
          setMessages((prev) => [
            ...prev,
            {
              message: data.message,
              nickname: data.sender,
              timestamp: data.timestamp,
              is_system: data.is_system,
            },
          ]);
        } else {
          console.warn('💥 메시지 구조가 예상과 다름:', data);
        }
      } catch (err) {
        console.error('JSON 파싱 실패:', err, e.data);
      }
    };

    ws.current.onclose = (e) => {
      console.warn('🔌 WebSocket 종료됨:', e.code, e.reason || '(이유 없음)');
    };

    return () => {
      ws.current.close();
    };
  }, [roomId, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== '' && ws.current && nickname) {
      ws.current.send(
        JSON.stringify({
          message: input,
        })
      );
      setInput('');
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          height: '100vh',
          py: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            height: 'calc(100vh - 32px)',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              채팅방
            </Typography>
          </Box>

          <StyledPaper elevation={0}>
            {Array.isArray(messages) ? (
              messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    alignSelf: msg.is_system
                      ? 'center'
                      : msg.nickname === nickname
                      ? 'flex-end'
                      : 'flex-start',
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 2,
                    width: '100%',
                    justifyContent: msg.is_system
                      ? 'center'
                      : msg.nickname === nickname
                      ? 'flex-end'
                      : 'flex-start',
                  }}
                >
                  {msg.is_system ? (
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        maxWidth: '80%',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontStyle: 'italic',
                          textAlign: 'center',
                        }}
                      >
                        {msg.message}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {msg.nickname !== nickname && (
                        <Avatar
                          src={''}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'secondary.main',
                            flexShrink: 0,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => navigate(`/profile/${msg.nickname}`)}
                        >
                          {msg.nickname && msg.nickname[0]
                            ? msg.nickname[0].toUpperCase()
                            : '?'}
                        </Avatar>
                      )}
                      <Box
                        sx={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        {msg.nickname !== nickname && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              ml: msg.nickname === nickname ? 'auto' : 0,
                            }}
                          >
                            {msg.nickname}
                          </Typography>
                        )}
                        <MessageBubble isUser={msg.nickname === nickname}>
                          <Typography
                            variant="body1"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {msg.message}
                          </Typography>
                        </MessageBubble>
                      </Box>
                    </>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ mt: 2, textAlign: 'center' }}>
                메시지가 없어요!
              </Typography>
            )}
            <div ref={scrollRef} />
          </StyledPaper>

          <Box
            sx={{
              p: 2,
              bgcolor: '#fff',
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                size="medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>

      <LoginConfirmDialog
        open={askLogin}
        onClose={() => setAskLogin(false)} // 취소
        onConfirm={
          () => navigate('/login', { state: { from: '/chat-list' } }) // 로그인
        }
      />
    </>
  );
};

export default ChatPage;
