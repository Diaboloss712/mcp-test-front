import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";
import {
  registerWithSocialInfo,
  type RegisterResponse,
} from "../services/authService";

export default function Register(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email");
  const providerParam = searchParams.get("provider");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!emailParam || !providerParam) {
      setError("유효하지 않은 접근입니다.");
    } else {
      setEmail(emailParam);
      setProvider(providerParam);
    }
  }, [emailParam, providerParam]);

  const handleSubmit = async () => {
    if (!username) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const data: RegisterResponse = await registerWithSocialInfo(
        email,
        provider,
        username
      );
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`회원가입 실패: ${err.message}`);
      } else {
        setError("서버 오류로 회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">소셜 회원가입</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-1 font-medium">이메일</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4 bg-gray-100 text-gray-600"
        value={email}
        readOnly
      />

      <label className="block mb-1 font-medium">소셜</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4 bg-gray-100 text-gray-600"
        value={provider}
        readOnly
      />

      <label className="block mb-1 font-medium">닉네임</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="닉네임 입력"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        회원가입
      </button>
    </div>
  );
}
