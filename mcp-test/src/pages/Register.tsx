import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";
import {
  registerWithEmail,
  registerWithSocialInfo,
  type RegisterResponse,
} from "../services/authService";

export default function Register(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email");
  const providerParam = searchParams.get("provider");

  const isSocial = !!(emailParam && providerParam);

  const [email, setEmail] = useState(emailParam || "");
  const [provider, setProvider] = useState(providerParam || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailParam && providerParam) {
      setEmail(emailParam);
      setProvider(providerParam);
    } else if (emailParam || providerParam) {
      setError("잘못된 소셜 로그인 요청입니다.");
    }
  }, [emailParam, providerParam]);

  const handleSubmit = async () => {
    setError("");

    if (!username) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      let data: RegisterResponse;

      if (isSocial) {
        data = await registerWithSocialInfo(email, provider, username);
      } else {
        if (!email || !password) {
          setError("이메일과 비밀번호를 입력해주세요.");
          return;
        }

        if (password.length < 8) {
          setError("비밀번호는 8자 이상이어야 합니다.");
          return;
        }

        data = await registerWithEmail(email, password, username);
      }

      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`회원가입 실패: ${err.message}`);
      } else {
        setError("서버 오류로 회원가입에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">
        {isSocial ? "소셜 회원가입" : "회원가입"}
      </h2>

      {error && (
        <p className="text-red-500 mb-2 transition-opacity duration-300 opacity-100">
          {error}
        </p>
      )}

      <label className="block mb-1 font-medium">이메일</label>
      <input
        type="text"
        className={`w-full p-2 border rounded mb-4 ${
          isSocial ? "bg-gray-100 text-gray-600" : ""
        }`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly={isSocial}
        placeholder="이메일 입력"
      />

      {isSocial && (
        <>
          <label className="block mb-1 font-medium">소셜</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4 bg-gray-100 text-gray-600"
            value={provider}
            readOnly
          />
        </>
      )}

      {!isSocial && (
        <>
          <label className="block mb-1 font-medium">비밀번호</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력 (8자 이상)"
          />
        </>
      )}

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
        disabled={loading}
        className={`w-full p-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "처리 중..." : "회원가입"}
      </button>
    </div>
  );
}
