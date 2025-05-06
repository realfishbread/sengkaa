export const boxStyle = {
  maxWidth: 500,
  margin: '3rem auto',
  padding: '2rem',
  borderRadius: '12px',
  backgroundColor: '#ffffff', // ✅ 메인 배경색과 동일하게
  fontFamily: "'Pretendard Variable', sans-serif", // ✅ 폰트 통일
};

export const buttonStyle = {
  backgroundColor: '#0056b3', // ✅ 네비게이션 버튼과 동일한 색상
  color: 'white',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '10px',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: '#004494',
  },
};

export const inputFieldStyle = {
  backgroundColor: 'white',
  borderRadius: '6px',
};

// src/components/common/Styles.js
export const titleStyle = {
  textAlign: 'center',
  marginBottom: '16px',
  fontWeight: 'bold',
  fontSize: '24px',
};

export const toggleButtonGroupStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '10px',
};

export const registerBox = {
  borderRadius: '12px',
  padding: '24px',
  backgroundColor: '#e9ecef',
};
