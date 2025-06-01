import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Autocomplete,
  Paper,
  Avatar,
  Pagination,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './ChatLobbyPage.css';
import axiosInstance from '../../shared/api/axiosInstance';

const ROOMS_PER_PAGE = 5;

const ChatLobbyPage = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
  const currentRooms = rooms.slice(
    (page - 1) * ROOMS_PER_PAGE,
    page * ROOMS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get('/user/chat/list/', {
        params: { q: search }
      });
      setRooms(res.data);
      setPage(1); // 검색 결과가 변경될 때 첫 페이지로 이동
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
      members: selectedUsers.map((user) => user.nickname)
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
  }, [fetchRooms, search]);

  useEffect(() => {
    if (userQuery.length >= 1) {
      fetchUsers(userQuery);
    }
  }, [userQuery]);

  return (
    <div className="chat-lobby-container">
      {/* 헤더 섹션 - 원래 스타일 유지 */}
      <div className="chat-lobby-header">
        <h1>💬 실시간 채팅</h1>
        <p>다른 팬들과 실시간으로 소통하고 정보를 공유해보세요</p>
      </div>

      {/* 기능 섹션 */}
      <div className="features-section">
        {/* 채팅방 생성 카드 */}
        <div className="feature-card create-room-card">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon /> 새로운 채팅방 만들기
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              새로운 채팅방을 만들어 대화를 시작하세요
            </Typography>
          </Box>
          <TextField
            fullWidth
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="채팅방 이름"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateRoom}
            sx={{
              bgcolor: 'white',
              color: '#6C63FF',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            채팅방 만들기
          </Button>
        </div>

        {/* 유저 초대 카드 */}
        <div className="feature-card invite-users-card">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon /> 참여할 유저 초대하기
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              친구들을 채팅방에 초대하세요
            </Typography>
          </Box>
          <Autocomplete
            multiple
            options={userResults}
            getOptionLabel={(option) => option.username}
            onChange={(e, newValue) => setSelectedUsers(newValue)}
            onInputChange={(e, value) => setUserQuery(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="유저 검색"
                size="small"
                sx={{ mb: 2 }}
              />
            )}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: '#38B2AC',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            초대하기
          </Button>
        </div>

        {/* 채팅방 검색 카드 */}
        <div className="feature-card search-card">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon /> 채팅방 검색
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              원하는 채팅방을 찾아보세요
            </Typography>
          </Box>
          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="채팅방 이름으로 검색"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={fetchRooms}
            sx={{
              bgcolor: '#4A5568',
              '&:hover': { bgcolor: '#2D3748' }
            }}
          >
            검색
          </Button>
        </div>
      </div>

      {/* 채팅방 목록 섹션 */}
      <div className="chat-rooms-section">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">채팅방 목록</Typography>
          <Typography variant="body2" color="text.secondary">
            총 {rooms.length}개의 채팅방
          </Typography>
        </Box>
        
        <div className="chat-room-list">
          <TransitionGroup>
            {currentRooms.map((room) => (
              <CSSTransition key={room.id} timeout={300} classNames="fade">
                <div className="chat-room-item" onClick={() => navigate(`/chat/${room.id}`)}>
                  <div className="chat-room-header">
                    <div className="chat-room-avatar">
                      {room.name[0].toUpperCase()}
                    </div>
                    <div className="chat-room-info">
                      <div className="chat-room-title">{room.name}</div>
                      <div className="chat-room-meta">
                        <span>👥 {room.current_participants}/{room.max_participants}명</span>
                        <span>•</span>
                        <span>{new Date(room.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        minWidth: '100px'
                      }}
                    >
                      참여하기
                    </Button>
                  </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>

        {/* 결과가 없을 때 메시지 */}
        {rooms.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              채팅방이 없습니다.
            </Typography>
          </Box>
        )}

        {/* 페이지네이션 */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Pagination 
            count={totalPages || 1} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton 
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.95rem',
                color: '#666',
                '&:hover': {
                  bgcolor: 'rgba(108, 99, 255, 0.08)'
                }
              },
              '& .Mui-selected': {
                bgcolor: '#6C63FF !important',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#6C63FF !important'
                }
              }
            }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {page} / {totalPages || 1} 페이지
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default ChatLobbyPage;
