import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyResetCode } from "../api/passwordApi";

export default function VerifyCodePage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerify = async () => {
    try {
      await verifyResetCode(email, code);
      alert("인증 성공!");
      navigate("/reset-password/", { state: { email } });
    } catch (e) {
      alert("인증 실패: " + (e.response?.data?.error || "알 수 없는 에러"));
    }
  };

  return (
    <div>
      <h2>인증 코드 확인</h2>
      <p>이메일: {email}</p>
      <input
        type="text"
        placeholder="인증 코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleVerify}>확인</button>
    </div>
  );
}
