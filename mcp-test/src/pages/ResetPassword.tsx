import { useState } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ msg: string }>(
        "/api/v1/auth/reset-password",
        {
          token,
          new_password: newPassword,
        }
      );
      setMessage(response.data.msg);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.detail || "요청 실패");
      } else {
        setMessage("알 수 없는 에러가 발생했습니다.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">비밀번호 재설정</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="전달받은 토큰"
          className="border p-2 w-full"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="password"
          placeholder="새 비밀번호"
          className="border p-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          비밀번호 재설정
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
