import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoginConfirmDialog from '../../components/common/LoginConfirmDialog';
import axiosInstance from '../../shared/api/axiosInstance';
import { UserContext } from '../../context/UserContext';
import './ChatLobbyPage.css';

const ROOMS_PER_PAGE = 5;

const ChatLobbyPage = () => {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [askLogin, setAskLogin] = useState(false);
  const {user}=useContext(UserContext);

  // 현재 페이지에 보여줄 채팅방 목록 계산
  const currentRooms = Array.isArray(rooms)
    ? rooms.slice((page - 1) * ROOMS_PER_PAGE, page * ROOMS_PER_PAGE)
    : [];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('https://eventcafe.site/user/chat/list/', {
        params: {
          q: search,
          page: page,
          per_page: ROOMS_PER_PAGE, // 서버에 페이지당 개수 전달
        },
      });
      const roomData = res.data.results || res.data;
      setRooms(roomData);

      // 전체 개수가 있는 경우에만 페이지 수 계산
      if (res.data.count !== undefined) {
        setTotalPages(Math.ceil(res.data.count / ROOMS_PER_PAGE));
      } else {
        // 전체 개수가 없는 경우 현재 데이터 길이로 계산
        setTotalPages(Math.ceil(roomData.length / ROOMS_PER_PAGE));
      }
    } catch (err) {
      console.error('방 목록 불러오기 실패:', err);
      setTotalPages(1);
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
      participants: selectedUsers.map((user) => user.nickname),
      max_participants: maxParticipants, // ✅ 사용자가 설정한 값
    };

    try {
      const res = await axiosInstance.post('/user/chat/create/', payload);
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      console.error('방 만들기 실패:', err);
      if (err.response?.status === 401) {
          setAskLogin(true);
          return;
        }
        if (!user) {
          // loading 끝난 뒤에만 질문
          setAskLogin(true); // 모달 오픈
        } else {
          alert('댓글 등록에 실패했습니다.');
        }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [search]); // page 의존성 제거

  // 페이지 변경 시 새로운 데이터 요청
  useEffect(() => {
    if (page > 1) {
      fetchRooms();
    }
  }, [page]);

  useEffect(() => {
    if (userQuery.length >= 1) {
      fetchUsers(userQuery);
    }
  }, [userQuery]);

  return (
    <>
      <div className="chat-lobby-container">
        <div className="chat-lobby-header">
          <h1>💬 실시간 채팅</h1>
          <p>다른 팬들과 실시간으로 소통하고 정보를 공유해보세요</p>
        </div>

        <div className="features-section">
          {/* 통합된 카드 */}
          <div className="feature-card create-room-card">
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AddIcon /> 새로운 채팅방 만들기
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                채팅방 이름과 초대 유저를 입력하세요
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

            <Autocomplete
              multiple
              options={userResults}
              getOptionLabel={(option) => option.nickname}
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

            <TextField
              type="number"
              label="최대 인원 수"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              inputProps={{ min: 2, max: 100 }}
              fullWidth
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
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              채팅방 만들기
            </Button>
          </div>

          {/* 채팅방 검색 카드 */}
          <div className="feature-card search-card">
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
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
                '&:hover': { bgcolor: '#2D3748' },
              }}
            >
              검색
            </Button>
          </div>
        </div>

        <div className="chat-rooms-section">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">채팅방 목록</Typography>
            <Typography variant="body2" color="text.secondary">
              총 {Array.isArray(rooms) ? rooms.length : 0}개의 채팅방
            </Typography>
          </Box>

          <div className="chat-room-list">
            <TransitionGroup>
              {currentRooms.map((room) => (
                <CSSTransition key={room.id} timeout={300} classNames="fade">
                  <div
                    className="chat-room-item"
                    onClick={() => navigate(`/chat/${room.id}`)}
                  >
                    <div className="chat-room-header">
                      <div className="chat-room-avatar">
                        {room.name[0].toUpperCase()}
                      </div>
                      <div className="chat-room-info">
                        <div className="chat-room-title">{room.name}</div>
                        <div className="chat-room-meta">
                          <span>
                            👥 {room.current_participants}/
                            {room.max_participants}명
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          minWidth: '100px',
                        }}
                        onClick={() => {
                          navigate(`/chat/${room.id}`); // ✅ 입장
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

          {rooms.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                채팅방이 없습니다.
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
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
                    bgcolor: 'rgba(108, 99, 255, 0.08)',
                  },
                },
                '& .Mui-selected': {
                  bgcolor: '#6C63FF !important',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#6C63FF !important',
                  },
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {page} / {totalPages || 1} 페이지
            </Typography>
          </Box>
        </div>
      </div>
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

export default ChatLobbyPage;
