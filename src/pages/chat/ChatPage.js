import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatPage = ({ roomId, username, profileImage }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const scrollRef = useRef(null);
  const token=localStorage.getItem('accessToken');

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

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" align="center">
        실시간 채팅방 #{roomId}
      </Typography>

      <Paper
        elevation={3}
        sx={{ p: 2, height: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
              mb: 1,
              maxWidth: '80%',
              display: 'flex',
              flexDirection: msg.username === username ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Avatar src={msg.username === username ? profileImage : ''}>
              {msg.username[0].toUpperCase()}
            </Avatar>
            <Box
              sx={{
                bgcolor: msg.username === username ? '#DCF8C6' : '#f1f1f1',
                p: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          </Box>
        ))}
        <div ref={scrollRef} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <Button variant="contained" onClick={handleSend} endIcon={<SendIcon />} sx={{ whiteSpace: 'nowrap' }}>
          전송
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
