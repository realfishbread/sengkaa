import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, Paper, Container, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

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

const ChatPage = ({ roomId, username = '사용자', profileImage }) => {
  const [messages, setMessages] = useState([
    {
      username: 'host',
      message: '채팅방에 오신 것을 환영합니다! 궁금하신 점이 있으시다면 편하게 물어보세요 😊',
      profileImage: '',
    },
    {
      username: username,
      message: '안녕하세요! 이벤트 관련해서 문의드리고 싶은게 있어요.',
      profileImage: profileImage || '',
    }
  ]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const scrollRef = useRef(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    ws.current = new WebSocket(`wss://eventcafe.site/ws/chat/room/${roomId}/?token=${token}`);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current.close();
    };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== '') {
      ws.current.send(JSON.stringify({
        type: 'chat.message',
        message: input,
        username: username,
      }));
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
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100vh',
        py: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100vh - 32px)',
          borderRadius: 2, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            채팅방 #{roomId}
          </Typography>
        </Box>

        <StyledPaper elevation={0}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
                mb: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 2,
                width: '100%',
                justifyContent: msg.username === username ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.username !== username && (
                <Avatar
                  src={''}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'secondary.main',
                    flexShrink: 0,
                  }}
                >
                  {msg.username && msg.username[0] ? msg.username[0].toUpperCase() : '?'}
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
                {msg.username !== username && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      ml: msg.username === username ? 'auto' : 0,
                    }}
                  >
                    {msg.username}
                  </Typography>
                )}
                <MessageBubble isUser={msg.username === username}>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {msg.message}
                  </Typography>
                </MessageBubble>
              </Box>
            </Box>
          ))}
          <div ref={scrollRef} />
        </StyledPaper>

        <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
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
  );
};

export default ChatPage;
