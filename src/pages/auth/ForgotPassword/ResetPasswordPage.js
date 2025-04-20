import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/passwordApi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const handleReset = async () => {
    try {
      await resetPassword(email, password);
      alert("비밀번호가 변경되었습니다!");
      navigate("/login/");
    } catch (e) {
      alert("변경 실패: " + (e.response?.data?.error || "알 수 없는 에러"));
    }
  };

  return (
    <div>
      <h2>새 비밀번호 입력</h2>
      <p>이메일: {email}</p>
      <input
        type="password"
        placeholder="새 비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>비밀번호 변경</button>
    </div>
  );
}
