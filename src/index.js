import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App"; // ✅ MainApp을 최상위로 사용
import Footer from "./components/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    
    <App />
    
  </React.StrictMode>
);

// 퍼포먼스 측정 함수 (선택 사항)
reportWebVitals();
