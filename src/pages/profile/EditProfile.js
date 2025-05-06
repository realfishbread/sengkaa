import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';

export default function EditProfile() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const { user, setUser } = useContext(UserContext); // ✅ 로그인된 유저

  // ✅ 유저 정보가 들어오면 state에 반영
  useEffect(() => {
    if (user) {
      if (user?.profile_image) {
        setPreviewImage(user.profile_image); // URL로 설정
      }
      setNickname(user.nickname || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('email', email);
      formData.append('bio', bio);
      if (profileImage) {
        formData.append('profile_image', profileImage); // ✅ 파일도 추가!
      }

      const response = await axiosInstance.patch(
        '/user/profile/update/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ FormData 보낼 때는 무조건 이거 필요해
          },
        }
      );

      // 수정 성공하면 UserContext 업데이트
      setUser(response.data);

      alert('변경사항이 저장되었습니다!');
    } catch (error) {
      console.error(error);
      alert('저장 실패, 다시 시도해주세요.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>프로필 수정</h2>

        {/* 프로필 사진 */}
        <div style={styles.imageContainer}>
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile Preview"
              style={styles.profileImage}
            />
          ) : (
            <div style={styles.defaultProfile}>사진</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setProfileImage(file);
              setPreviewImage(URL.createObjectURL(file));
            }}
            style={{ marginTop: '10px' }}
          />
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            style={styles.input}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            style={styles.input}
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개"
            style={styles.textarea}
          />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.saveButton}>
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9ff, #e0e7ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '40px 32px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
    width: '100%',
    maxWidth: '480px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '28px',
    fontSize: '26px',
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    marginBottom: '24px',
    position: 'relative',
  },
  profileImage: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #7a70ff',
    marginBottom: '10px',
    transition: '0.3s ease',
  },
  defaultProfile: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    backgroundColor: '#dcdcdc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    border: '2px dashed #aaa',
    position: 'relative',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '15px',
    minHeight: '100px',
    resize: 'vertical',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  },
  buttonContainer: {
    marginTop: '22px',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    color: '#fff',
    padding: '13px 28px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.25s ease, transform 0.2s',
  },
};
