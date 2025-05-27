import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, List, ListItem, ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatLobbyPage = () => {
  const [roomName, setRoomName] = useState('');
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`/user/chat/list/?q=${search}`);
      setRooms(res.data);
    } catch (err) {
      console.error('방 목록 불러오기 실패:', err);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    try {
      const res = await axios.post('/user/chat/create/', { name: roomName });
      navigate(`/chat/${res.data.roomId}`);
    } catch (err) {
      console.error('방 만들기 실패:', err);
    }
  };

  const handleSearch = () => {
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        채팅 로비
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="방 이름"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleCreateRoom}>
          방 만들기
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="방 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" onClick={handleSearch}>
          검색
        </Button>
      </Box>

      <Typography variant="h6">채팅방 목록</Typography>
      <List>
        {rooms.map((room) => (
          <ListItem button key={room.id} onClick={() => navigate(`/chat-list`)}>
            <ListItemText primary={room.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatLobbyPage;
