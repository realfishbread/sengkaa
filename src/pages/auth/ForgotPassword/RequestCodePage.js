import React, { useState } from "react";
import { sendResetEmail } from "../api/passwordApi";
import { useNavigate } from "react-router-dom";

export default function RequestCodePage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSend = async () => {
    try {
      await sendResetEmail(email);
      alert("인증 코드가 전송되었습니다.");
      navigate("/verify-code", { state: { email } });
    } catch (e) {
      alert("오류: " + (e.response?.data?.error || "알 수 없는 에러"));
    }
  };

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSend}>인증 코드 받기</button>
    </div>
  );
}
