import ReportIcon from '@mui/icons-material/Report'; // ✅ 맨 위에 추가
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReportModal from '../../components/common/ReportModal'; // 신고 모달 컴포넌트 추가
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';
import '../../styles/fade.css'; // ✅ 만든 fade.css 경로에 맞게 import

const Board = () => {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [openPostId, setOpenPostId] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [replies, setReplies] = useState({});
  const [filter, setFilter] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 추가

  useEffect(() => {
    if (!user) {
      const savedUser = JSON.parse(localStorage.getItem('userInfo'));
      if (savedUser) setUser(savedUser);
    }

    fetchPosts('all'); // ✅ 최초 로딩
    // ✅ 등록 후 돌아왔을 때 새로고침
    if (location.state?.refresh) {
      fetchPosts('all');
    }
  }, [location.state]); // ← 여기를 감시

  const fetchPosts = (type) => {
    setFilter(type);

    let url = '/user/posts/';
    if (type === 'open') url = '/user/posts/open/';
    else if (type === 'closed') url = '/user/posts/closed/';

    axiosInstance
      .get(url)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  };

  const handleReplySubmit = (postId) => {
    if (!replyContent[postId]) return; // 빈 댓글 방지

    axiosInstance
      .post('/user/posts/replies/', {
        post: postId,
        content: replyContent[postId],
      })
      .then((res) => {
        alert('댓글이 등록되었습니다!');
        setReplyContent((prev) => ({ ...prev, [postId]: '' }));

        fetchReplies(postId); // 🔥 댓글 등록 성공 후 목록 새로고침
      })
      .catch((err) => {
        console.error(err);
        alert('댓글 등록에 실패했습니다.');
      });
  };

  const fetchReplies = (postId) => {
    axiosInstance
      .get(`/user/posts/${postId}/replies/`)
      .then((res) => {
        setReplies((prev) => ({ ...prev, [postId]: res.data }));
      })
      .catch((err) => {
        console.error('댓글 가져오기 실패:', err);
      });
  };

  const handleReportClick = (postId) => {
    setReportPostId(postId);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportPostId(null);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', my: 6, px: 2 }}>
      {/* ✅ 예쁜 배경 헤더 */}
      <Box
        sx={{
          width: '100%',
          py: 6,
          px: 2,
          borderRadius: 3,
          backgroundColor: '#f0fff4', // 👉 배경색 따로 분리!
          backgroundImage: `
      radial-gradient(circle at 20% 40%, rgba(30, 136, 229, 0.12) 120px, transparent 120px),
      radial-gradient(circle at 70% 60%, rgba(30, 136, 229, 0.08) 120px, transparent 120px),
      radial-gradient(circle at 70% 60%, rgba(30, 136, 229, 0.08) 120px, transparent 120px)
    `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: 'Black',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          🎂 팬 이벤트 공동주최자 모집 게시판
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, color: '#555' }}>
          함께할 동료를 찾고, 더 특별한 이벤트를 만들어보세요 💫
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          onClick={() => fetchPosts('all')}
        >
          전체
        </Button>
        <Button
          variant={filter === 'open' ? 'contained' : 'outlined'}
          onClick={() => fetchPosts('open')}
        >
          모집중
        </Button>
        <Button
          variant={filter === 'closed' ? 'contained' : 'outlined'}
          onClick={() => fetchPosts('closed')}
        >
          모집완료
        </Button>
      </Stack>

      {/* ✅ 글작성 버튼 오른쪽 정렬 */}
      <Box sx={{ textAlign: 'right', mb: 4 }}>
        <Button variant="contained" onClick={() => navigate('/post')}>
          글 작성
        </Button>
      </Box>

      {/* 글 목록 */}
      <TransitionGroup>
        {posts.map((post) => (
          <CSSTransition key={post.id} timeout={300} classNames="fade">
            <Paper
              onClick={() => {
                setOpenPostId(post.id);
                fetchReplies(post.id);
              }}
              elevation={1}
              sx={{
                p: 3,
                mb: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: '#fff',
                position: 'relative', // ✅ 신고버튼 위치 유지!
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#1e88e5',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                },
              }}
            >
              {/* 작성자 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={post.profile_image}
                  alt={post.nickname}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${post.nickname}`)}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${post.nickname}`)}
                  >
                    {post.nickname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {post.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  color: '#444',
                  lineHeight: 1.6,
                  ...(openPostId !== post.id && {
                    maxHeight: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }),
                }}
              >
                {post.content}
              </Typography>

              {post.image && (
                <Box mt={2}>
                  <img
                    src={post.image}
                    alt="썸네일"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Box>
              )}

              <Box mt={2}>
                <Chip label="모집중" color="success" size="small" />
              </Box>

              {user?.nickname === post.nickname && (
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('정말 게시글을 삭제하시겠습니까?')) {
                        axiosInstance
                          .delete(`/user/posts/${post.id}/`)
                          .then(() => {
                            alert('삭제되었습니다!');
                            setPosts((prev) =>
                              prev.filter((p) => p.id !== post.id)
                            );
                          })
                          .catch(() => alert('삭제 실패'));
                      }
                    }}
                  >
                    게시글 삭제
                  </Button>
                </Box>
              )}

              <Button
                variant="text"
                color="error"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  minWidth: 0,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: 'rgba(255,0,0,0.1)',
                  },
                }}
                onClick={() => handleReportClick(post.id)}
              >
                <ReportIcon fontSize="small" />
              </Button>

              {isReportModalOpen && (
                <ReportModal postId={reportPostId} onClose={closeReportModal} />
              )}

              {openPostId === post.id && (
                <>
                  {!replies[post.id] || replies[post.id].length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 2, mt: 2 }}
                    >
                      아직 댓글이 없어요! 🥲
                    </Typography>
                  ) : (
                    replies[post.id]?.map((reply) => {
                      const isReply = reply.parent_id !== null;

                      return (
                        <Box
                          key={reply.id}
                          sx={{
                            mt: 1,
                            pl: isReply ? 4 : 2,
                            py: 1,
                            px: 2,
                            justifyContent: 'center', // ✅ 가운데 정렬
                            borderRadius: 1,
                            backgroundColor: isReply
                              ? '#f5f5f5'
                              : 'transparent',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              maxWidth: 700, // ✅ 댓글 최대 너비 제한 (선택)
                              pl: isReply ? 4 : 2,
                              py: 1,
                              px: 2,
                              borderRadius: 1,
                              backgroundColor: isReply
                                ? '#f5f5f5'
                                : 'transparent',
                            }}
                          >
                            <Typography variant="body2">
                              💬{' '}
                              <span
                                style={{
                                  fontWeight: 'bold',
                                  color: '#1976d2',
                                  cursor: 'pointer',
                                }}
                                onClick={() =>
                                  navigate(`/profile/${reply.user.nickname}`)
                                }
                              >
                                {reply.user.nickname}
                              </span>{' '}
                              ({new Date(reply.created_at).toLocaleString()}):{' '}
                              {reply.content}
                              {replies[post.id]?.map((reply) => {
                                const isOwner =
                                  user?.nickname === reply.user.nickname;
                                const isEditing = editingReplyId === reply.id;

                                return (
                                  <Box key={reply.id} sx={{ mt: 1, pl: 2 }}>
                                    <Typography variant="body2">
                                      <strong>{reply.user.nickname}</strong> (
                                      {new Date(
                                        reply.created_at
                                      ).toLocaleString()}
                                      ):
                                    </Typography>

                                    {isEditing ? (
                                      <>
                                        <input
                                          value={editedContent}
                                          onChange={(e) =>
                                            setEditedContent(e.target.value)
                                          }
                                          style={{
                                            width: '100%',
                                            padding: '8px',
                                            marginTop: '4px',
                                            border: '1px solid #ccc',
                                            borderRadius: '6px',
                                          }}
                                        />
                                        <Stack
                                          direction="row"
                                          spacing={1}
                                          sx={{ mt: 1 }}
                                        >
                                          <Button
                                            variant="contained"
                                            size="small"
                                            onClick={async () => {
                                              try {
                                                await axiosInstance.patch(
                                                  `/user/posts/replies/${reply.id}/`,
                                                  {
                                                    content: editedContent,
                                                  }
                                                );
                                                alert('수정 완료!');
                                                setEditingReplyId(null);
                                                setEditedContent('');
                                                fetchReplies(post.id);
                                              } catch (err) {
                                                alert('수정 실패');
                                                console.error(err);
                                              }
                                            }}
                                          >
                                            저장
                                          </Button>
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                              setEditingReplyId(null);
                                              setEditedContent('');
                                            }}
                                          >
                                            취소
                                          </Button>
                                        </Stack>
                                      </>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                                      >
                                        {reply.content}
                                      </Typography>
                                    )}

                                    {isOwner && !isEditing && (
                                      <Box sx={{ textAlign: 'right', mt: 1 }}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          onClick={() => {
                                            setEditingReplyId(reply.id);
                                            setEditedContent(reply.content);
                                          }}
                                          sx={{ mr: 1 }}
                                        >
                                          수정
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="error"
                                          onClick={async () => {
                                            if (
                                              window.confirm('정말 삭제할까요?')
                                            ) {
                                              try {
                                                await axiosInstance.delete(
                                                  `/user/posts/replies/${reply.id}/`
                                                );
                                                alert('삭제 완료!');
                                                fetchReplies(post.id);
                                              } catch (err) {
                                                alert('삭제 실패');
                                                console.error(err);
                                              }
                                            }
                                          }}
                                        >
                                          삭제
                                        </Button>
                                      </Box>
                                    )}
                                  </Box>
                                );
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })
                  )}
                  <Box mt={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <input
                        type="text"
                        placeholder="댓글을 입력하세요"
                        value={replyContent[post.id] || ''}
                        onChange={(e) =>
                          setReplyContent((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        style={{
                          flexGrow: 1,
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                        }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleReplySubmit(post.id)}
                      >
                        등록
                      </Button>
                    </Stack>
                  </Box>
                </>
              )}
            </Paper>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </Box>
  );
};
export default Board;
