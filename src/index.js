import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // ✅ MainApp을 최상위로 사용
import { UserProvider } from './context/UserContext'; // ★경로주의
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {' '}
    {/* 🔥 이게 반드시 있어야 함 */}
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

// 퍼포먼스 측정 함수 (선택 사항)
reportWebVitals();
