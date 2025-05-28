import {
  Autocomplete,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
  Avatar,
  Divider,
  Stack,
  Container,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/api/axiosInstance';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../styles/fade.css';
import './ChatLobbyPage.css';

const ChatLobbyPage = () => {
  const [roomName, setRoomName] = useState('');
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "2024 케이콘 일본 참여 인증방 🎫",
      member_count: 15,
      created_at: "2024-03-15T10:30:00"
    }
  ]);
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
      navigate(`/chat/${res.data.id}`);
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
    <Box 
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        py: 6,
        bgcolor: '#fafafa'
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          width: '100%',
          maxWidth: '900px !important',
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box 
          className="chat-lobby-header" 
          sx={{
            textAlign: 'center',
            mb: 5
          }}
        >
          <Typography variant="h4" fontWeight="bold" component="h1" sx={{ mb: 1 }}>
            💬 실시간 채팅
          </Typography>
          <Typography variant="subtitle1" component="p">
            다른 팬들과 실시간으로 소통하고 정보를 공유해보세요
          </Typography>
        </Box>

        <Box className="chat-lobby-content" sx={{ maxWidth: '850px', mx: 'auto' }}>
          {/* 방 생성 및 검색 섹션 */}
          <Paper 
            elevation={1} 
            className="search-create-section" 
            sx={{ 
              width: '100%',
              p: 2,
              '& .input-group': {
                mb: 1.5
              }
            }}
          >
            <Stack spacing={1.5} sx={{ width: '100%' }}>
              <div className="input-group">
                <Typography className="input-label">새로운 채팅방 만들기</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="방 이름"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="채팅방 이름을 입력하세요"
                  />
                  <Button
                    variant="contained"
                    onClick={handleCreateRoom}
                    className="create-room-button"
                  >
                    방 만들기
                  </Button>
                </Box>
              </div>

              <div className="input-group">
                <Typography className="input-label">참여할 유저 초대하기</Typography>
                <Autocomplete
                  multiple
                  options={userResults}
                  getOptionLabel={(option) => option.username}
                  onInputChange={(e, newInputValue) => setUserQuery(newInputValue)}
                  onChange={(e, newValue) => setSelectedUsers(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="유저 이름으로 검색"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </div>

              <div className="input-group">
                <Typography className="input-label">채팅방 검색</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="채팅방 이름으로 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    onClick={fetchRooms}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    검색
                  </Button>
                </Box>
              </div>
            </Stack>
          </Paper>

          {/* 채팅방 목록 */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              채팅방 목록
            </Typography>

            <TransitionGroup>
              {rooms.map((room) => (
                <CSSTransition key={room.id} timeout={300} classNames="fade">
                  <Paper
                    elevation={2}
                    className="chat-room-card"
                    onClick={() => navigate(`/chat/${room.id}`)}
                    sx={{
                      width: '100%',
                      p: 2,
                      mb: 1.5,
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => theme.shadows[4]
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        className="chat-room-avatar"
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48
                        }}
                      >
                        {room.name[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 'bold',
                            mb: 0.5
                          }}
                        >
                          {room.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5 
                          }}
                        >
                          👥 참여자: {room.member_count}명
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            display: 'block',
                            mb: 1
                          }}
                        >
                          {new Date(room.created_at).toLocaleString()}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="medium"
                          sx={{
                            borderRadius: 2,
                            px: 3
                          }}
                        >
                          참여하기
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ChatLobbyPage;
