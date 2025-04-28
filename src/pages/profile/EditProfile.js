import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../shared/api/axiosInstance';

export default function EditProfile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const { user, setUser } = useContext(UserContext); // ✅ 로그인된 유저

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('bio', bio);
      if (profileImage) {
        formData.append('profileImage', profileImage); // ✅ 파일도 추가!
      }

      const response = await axiosInstance.patch('/user/profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // ✅ FormData 보낼 때는 무조건 이거 필요해
        },
      });

      // 수정 성공하면 UserContext 업데이트
      setUser(response.data);

      alert('변경사항이 저장되었습니다');
    } catch (error) {
      console.error(error);
      alert('저장 실패');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>프로필 수정</h2>

        {/* 프로필 사진 */}
        <div style={styles.imageContainer}>
          {profileImage ? (
            <img
              src={URL.createObjectURL(profileImage)}
              alt="Profile Preview"
              style={styles.profileImage}
            />
          ) : (
            <div style={styles.defaultProfile}>사진</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
            style={{ marginTop: '10px' }}
          />
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    marginBottom: '20px',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  defaultProfile: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#777',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    fontSize: '14px',
  },
  textarea: {
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};
