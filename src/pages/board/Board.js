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
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import WarningBox from '../../components/common/WarningBox';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';
import '../../styles/fade.css'; // ✅ 만든 fade.css 경로에 맞게 import
import ReportModal from './api/ReportModal'; // 신고 모달 컴포넌트 추가

const Board = () => {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [openPostId, setOpenPostId] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [replies, setReplies] = useState({});
  const [filter, setFilter] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const savedUser = JSON.parse(localStorage.getItem('userInfo'));
      if (savedUser) setUser(savedUser);
    }

    fetchPosts('all'); // ✅ 최초 로딩
  }, []);

  const fetchPosts = (type, page = 1) => {
    setFilter(type);
    setCurrentPage(page);

    let url = '/user/posts/';
    if (type === 'open') url = '/user/posts/open/';
    else if (type === 'closed') url = '/user/posts/closed/';

    axiosInstance
      .get(url, { params: { page } }) // ✅ 쿼리로 페이지 넘기기
      .then((res) => {
        setPosts(res.data.results); // ✅ 페이지네이션 응답일 때는 .results
        const total = Math.ceil(res.data.count / 5);
        setTotalPages(total);
      })
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

      <WarningBox />

      <Stack direction="row" spacing={2} sx={{ mb: 4, mt: 4 }}>
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
                    src={`${post.image}`}
                    alt="썸네일"
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      maxWidth: '500px', // 💡 너무 크지 않게 조절
                      maxHeight: '700px',
                      objectPosition: 'center',
                      objectFit: 'cover', // ✨ 이미지가 비율 유지하면서 잘려도 예쁘게
                    }}
                  />
                </Box>
              )}

              <Box mt={2}>
                <Chip label="모집중" color="success" size="small" />
              </Box>

              {user?.nickname === post.nickname && (
                <Box
                  sx={{
                    textAlign: 'right',
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/post/edit/${post.id}`); // 수정 페이지로 이동
                    }}
                  >
                    게시글 수정
                  </Button>
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
                            borderRadius: 1,
                            backgroundColor: isReply
                              ? '#f5f5f5'
                              : 'transparent',
                          }}
                        >
                          <Typography variant="body2">
                            {/*프사 */}
                          <Avatar
                            alt={reply.user.nickname}
                            src={reply.user.profile_image}
                            sx={{ width: 28, height: 28, cursor: 'pointer' }}
                            onClick={() =>
                              navigate(`/profile/${reply.user.nickname}`)
                            }
                          />  {' '}
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
                            {reply.user.nickname === user?.nickname && (
                              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    const newContent = prompt(
                                      '댓글을 수정하세요',
                                      reply.content
                                    );
                                    if (!newContent || newContent.trim() === '')
                                      return;
                                    axiosInstance
                                      .patch(
                                        `/user/posts/replies/${reply.id}/`,
                                        { content: newContent }
                                      )
                                      .then(() => {
                                        alert('수정 완료!');
                                        fetchReplies(post.id);
                                      })
                                      .catch(() => alert('수정 실패'));
                                  }}
                                >
                                  수정
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    if (
                                      window.confirm('댓글을 삭제하시겠습니까?')
                                    ) {
                                      axiosInstance
                                        .delete(
                                          `/user/posts/replies/${reply.id}/`
                                        )
                                        .then(() => fetchReplies(post.id))
                                        .catch(() => alert('삭제 실패'));
                                    }
                                  }}
                                >
                                  삭제
                                </Button>
                              </Box>
                            )}
                          </Typography>
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
      {/* 페이지네이션 버튼 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* 이전 버튼 */}
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === 1}
          onClick={() => fetchPosts(filter, currentPage - 1)}
          sx={{
            borderRadius: '20px',
            minWidth: '40px',
            '&.Mui-disabled': {
              backgroundColor: '#f0f0f0',
              color: '#aaa',
            },
          }}
        >
          ◀
        </Button>

        {/* 숫자 버튼 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? 'contained' : 'outlined'}
            size="small"
            onClick={() => fetchPosts(filter, pageNum)}
            sx={{
              borderRadius: '50%',
              minWidth: '36px',
              height: '36px',
              backgroundColor:
                currentPage === pageNum ? '#6C63FF' : 'transparent',
              color: currentPage === pageNum ? '#fff' : '#444',
              borderColor: '#ccc',
              '&:hover': {
                backgroundColor:
                  currentPage === pageNum ? '#5a55d3' : '#f5f5f5',
              },
            }}
          >
            {pageNum}
          </Button>
        ))}

        {/* 다음 버튼 */}
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === totalPages}
          onClick={() => fetchPosts(filter, currentPage + 1)}
          sx={{
            borderRadius: '20px',
            minWidth: '40px',
            '&.Mui-disabled': {
              backgroundColor: '#f0f0f0',
              color: '#aaa',
            },
          }}
        >
          ▶
        </Button>
      </Box>
    </Box>
  );
};
export default Board;
