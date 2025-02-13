import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import MainApp from "./MainApp"; // ✅ MainApp을 최상위로 사용

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MainApp />  // ✅ MainApp을 렌더링 (Router 포함)
  </React.StrictMode>
);

// 퍼포먼스 측정 함수 (선택 사항)
reportWebVitals();
