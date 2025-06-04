import {
  Box,
  Button,
  Container,
  Divider, // 🔹 추가
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CustomTextField from '../../../components/common/CustomTextField';
import { buttonStyle } from '../../../components/common/Styles';
// 추가 import
import { useNavigate } from 'react-router-dom';
import AgePolicyModal from './policy/AgePoilcyModal';
import PrivacyPolicyModal from './policy/PrivacyPolicyModal';
import TermsModal from './policy/TermsModal';
import './Signup.css';

const SignupPage = () => {
  const [username, setUsername] = useState(''); // 🔹 추가 (이름 필드)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('regular'); // 🔹 기본값은 일반 사용자
  const [error, setError] = useState(''); // 🔹 백엔드 에러 메시지 상태 추가
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [timer, setTimer] = useState(180);
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState(''); // 🔥 닉네임 추가
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false); // ✅ 추가

  const [showPassword, setShowPassword] = useState(false);

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agree14, setAgree14] = useState(false); // 🔹 14세 이상 동의 추가

  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [openAgeModal, setOpenAgeModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timerInterval;
    if (showEmailVerification && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [showEmailVerification, timer]);

  useEffect(() => {
    if (agreeTerms && agreePrivacy && agreeMarketing) {
      setAgreeAll(true);
    } else {
      setAgreeAll(false);
    }
  }, [agreeTerms, agreePrivacy, agreeMarketing]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!code) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    setError(''); // 🔹 에러 초기화

    try {
      const response = await axios.post(
        'https://eventcafe.site/user/auth/register/',
        {
          username,
          nickname,
          email,
          password,
          user_type: userType, // 🔹 추가
        }
      );

      console.log('회원가입 성공:', response.data);
      alert('회원가입 성공! 로그인하세요.');
      navigate('/login', { state: { backgroundLocation: window.location } });
    } catch (err) {
      console.error('회원가입 실패:', err.response?.data);
      setError(
        err.response?.data?.error || '회원가입 실패. 다시 시도해주세요.'
      );
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post(
        'https://eventcafe.site/user/auth/verify-email-code/',
        {
          email,
          code,
        }
      );
      alert('✅ 이메일 인증이 완료되었습니다!');
      setIsEmailVerified(true); // ✅ 인증 완료 상태 저장
    } catch (err) {
      console.error('인증 실패:', err.response?.data);
      setError('❌ 인증 코드가 잘못되었거나 만료되었습니다.');
    }
  };

  const handleSendVerification = async () => {
    setShowEmailVerification(true);
    setTimer(300);

    try {
      const response = await axios.post(
        'https://eventcafe.site/user/auth/send-email-verification/',
        {
          email,
        }
      );
      console.log('인증 코드 전송 성공:', response.data);
      alert('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
      console.error('인증 코드 전송 실패:', err.response?.data);
      setError('인증 코드 전송에 실패했습니다.');
    }
  };

  const handleCheckNickname = async () => {
    const specialCharRegex = /[^a-zA-Z0-9가-힣]/;

    // ✅ 1. 특수문자 금지
    if (specialCharRegex.test(nickname)) {
      alert('❌ 닉네임에는 한글, 영어, 숫자만 사용할 수 있어요.');
      setNicknameChecked(false);
      setNicknameMessage('올바른 닉네임을 입력해주세요.');
      return;
    }

    // ✅ 2. 길이 제한 체크
    if (nickname.length < 2 || nickname.length > 12) {
      alert('❌ 닉네임은 2자 이상 12자 이하로 입력해주세요.');
      setNicknameChecked(false);
      setNicknameMessage('닉네임 길이를 확인해주세요.');
      return;
    }

    // ✅ 3. 서버에 중복 확인 요청
    try {
      const response = await axios.post(
        'https://eventcafe.site/user/auth/check-nickname/',
        { nickname }
      );

      if (response.data.available) {
        setNicknameChecked(true);
        setNicknameMessage(response.data.message);
      } else {
        setNicknameChecked(false);
        setNicknameMessage(response.data.message);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error.response?.data);
      setNicknameChecked(false);
      setNicknameMessage('중복 확인 실패. 다시 시도하세요.');
    }
  };

  const handleAllAgreeChange = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
    setAgree14(checked);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff', // ✅ 배경을 흰색으로 고정
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Container
        maxWidth="sm" // ✅ xs → sm으로 살짝 넓게
        sx={{
          borderRadius: '16px',
          backgroundColor: '#fff',
          padding: '3rem',
          maxWidth: '480px',
          margin: 'auto',
        }}
      >
        {/* 로고 섹션 - 로고 대신 '<' 아이콘 버튼만 추가 */}

        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 3, color: '#222' }}
        >
          회원가입
        </Typography>

        {error && (
          <Typography
            color="error"
            textAlign="center"
            sx={{ marginBottom: '1rem' }}
          >
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault(); // 폼 제출 기본 동작 방지
            handleSignup();
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Typography className="signup-label">이름</Typography>

            <CustomTextField
              label="실명을 적어주세요."
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
              fullWidth
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Typography className="signup-label">닉네임</Typography>

            <CustomTextField
              label="닉네임은 2글자 이상, 특수문자 불가합니다."
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameChecked(false); // 닉네임 수정하면 다시 확인 필요
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleCheckNickname}
              className="signup-button"
            >
              중복 확인
            </Button>
          </Box>
          {nicknameMessage && (
            <Typography
              variant="caption"
              color={nicknameChecked ? 'primary' : 'error'}
            >
              {nicknameMessage}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: -1, ml: 1 }}
          >
            * 특수문자는 사용할 수 없으며, 2자 이상 12자 이하로 입력해주세요.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Typography className="signup-label">이메일</Typography>
            <CustomTextField
              label="example@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendVerification}
              className="signup-button"
            >
              인증
            </Button>
          </Box>
          {showEmailVerification && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  textAlign: 'center',
                }}
              >
                <CustomTextField
                  label="인증 코드"
                  type="text"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleVerifyCode}
                  className="signup-button"
                  disabled={isEmailVerified} // ✅ 인증되었으면 비활성화 가능 (선택)
                >
                  인증 확인
                </Button>
              </Box>

              <Typography
                variant="body2"
                textAlign="right"
                color={timer > 0 ? '#555555' : '#FF0000'}
              >
                {timer > 0
                  ? `남은 시간: ${formatTime(timer)}`
                  : '인증 시간이 만료되었습니다.'}
              </Typography>

              {/* ✅ 인증 성공 메시지 추가 */}
              {isEmailVerified && (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mt: 1, textAlign: 'right' }}
                >
                  ✅ 이메일 인증이 완료되었습니다.
                </Typography>
              )}
            </>
          )}
          {/* 🔹 사용자 유형 선택 추가 */}
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          >
            <InputLabel>사용자 유형</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="regular">일반 사용자</MenuItem>
              <MenuItem value="organizer">주최측</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Typography className="signup-label">비밀번호</Typography>
            <CustomTextField
              label="특수문자, 숫자, 영문 대소문자를 포함하여 8자 이상이어야 합니다."
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />{' '}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography className="signup-label">비밀번호 확인</Typography>
            <CustomTextField
              label="비밀번호를 한번 더 입력해주세요."
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: -1, ml: 1 }}
          >
            * 비밀번호는 특수문자, 숫자, 영문 대소문자를 포함하여 8자 이상이어야
            합니다.
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ ml: 1, lineHeight: 1.6, mb: 2 }}
              gutterBottom
            >
              이용약관 동의
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                ml: 3,
                gap: 2,
                mb: 2,
              }}
            >
              <label className="checkbox-main">
                <label>
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={handleAllAgreeChange}
                  />{' '}
                  <strong>[전체 동의]</strong> 모든 항목에 동의합니다.
                </label>
              </label>

              <div className="checkbox-sub-group">
                <label>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />{' '}
                  [필수] 이용약관 동의
                  <Button
                    variant="text"
                    onClick={() => setOpenTermsModal(true)}
                  >
                    약관 보기
                  </Button>
                  <TermsModal
                    open={openTermsModal}
                    onClose={() => setOpenTermsModal(false)}
                  />{' '}
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    required
                  />{' '}
                  [필수] 개인정보 수집 및 이용 동의
                  <Button onClick={() => setOpenPrivacyModal(true)}>
                    약관 보기
                  </Button>
                  <PrivacyPolicyModal
                    open={openPrivacyModal}
                    onClose={() => setOpenPrivacyModal(false)}
                  />
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={agree14}
                    onChange={(e) => setAgree14(e.target.checked)}
                    required
                  />{' '}
                  [필수] 14세 이상 동의
                  <Button onClick={() => setOpenAgeModal(true)}>
                    약관 보기
                  </Button>
                  <AgePolicyModal
                    open={openAgeModal}
                    onClose={() => setOpenAgeModal(false)}
                  />
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                  />{' '}
                  [선택] 마케팅 정보 수신 동의
                </label>
              </div>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 3, lineHeight: 1.6, mb: 2 }}
            >
              * 이름, 닉네임, 이메일, 비밀번호는 모두 필수 항목입니다.
              <br />* 닉네임은 2자 이상 12자 이하, 특수문자 불가입니다.
              <br />* 이메일 인증을 완료해야 회원가입이 가능합니다.
            </Typography>
          </Box>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            onClick={handleSignup}
            sx={buttonStyle}
          >
            회원가입
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
