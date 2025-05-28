import {
  Autocomplete,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';

const ChatLobbyPage = () => {
  const [roomName, setRoomName] = useState('');
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get(`/user/chat/list/?q=${search}`);
      setRooms(res.data);
    } catch (err) {
      console.error('방 목록 불러오기 실패:', err);
    }
  };

  const fetchUsers = async (query) => {
    try {
      const res = await axiosInstance.get('/user/chat/search/', {
        params: { q: query },
      });
      setUserResults(res.data);
    } catch (err) {
      console.error('유저 검색 실패:', err);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    const payload = {
      name: roomName,
      members: selectedUsers.map((user) => user.id),
    };

    try {
      const res = await axiosInstance.post('/user/chat/create/', payload);
      navigate(`/chat/${res.data.id}`); // or .roomId
    } catch (err) {
      console.error('방 만들기 실패:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (userQuery.length >= 1) {
      fetchUsers(userQuery);
    }
  }, [userQuery]);

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
        <Button variant="contained" onClick={handleCreateRoom} sx={{ whiteSpace: 'nowrap' }}>
          방 만들기
        </Button>
      </Box>

      <Autocomplete
        multiple
        options={userResults}
        getOptionLabel={(option) => option.username}
        onInputChange={(e, newInputValue) => setUserQuery(newInputValue)}
        onChange={(e, newValue) => setSelectedUsers(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="유저 검색 및 초대" variant="outlined" />
        )}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="방 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" onClick={fetchRooms}>
          검색
        </Button>
      </Box>

      <Typography variant="h6">채팅방 목록</Typography>
      <List>
        <ListItem
          button
          onClick={() => navigate(`/chat/1`)}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            mb: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            }
          }}
        >
          <ListItemText 
            primary="이벤트 카페 단톡방" 
            secondary="참여자: 3명"
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: 'bold',
                color: '#333'
              }
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default ChatLobbyPage;
