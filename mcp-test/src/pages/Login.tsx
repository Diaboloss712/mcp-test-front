import type { JSX } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { loginWithEmail } from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const PROVIDER_CONFIG: Record<
  string,
  { name: string; authUrl: string; scope: string }
> = {
  google: {
    name: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
  },
  github: {
    name: "GitHub",
    authUrl: "https://github.com/login/oauth/authorize",
    scope: "read:user user:email",
  },
  kakao: {
    name: "Kakao",
    authUrl: "https://kauth.kakao.com/oauth/authorize",
    scope: "profile",
  },
  naver: {
    name: "Naver",
    authUrl: "https://nid.naver.com/oauth2.0/authorize",
    scope: "profile",
  },
};

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSocialLogin = (provider: string) => {
    const config = PROVIDER_CONFIG[provider];
    const clientId = import.meta.env[
      `VITE_${provider.toUpperCase()}_CLIENT_ID`
    ];
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const state = btoa(JSON.stringify({ provider, nonce: uuidv4() }));

    sessionStorage.setItem("oauth_state", state);

    const authUrl =
      `${config.authUrl}?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(config.scope)}` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = authUrl;
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await loginWithEmail(email, password);
      localStorage.setItem("token", res.access_token);
      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const message =
        error.response?.data?.detail || error.message || "서버 오류";
      setError("로그인 실패: " + message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 space-y-6 border rounded shadow">
      <h2 className="text-xl font-semibold text-center">로그인</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-2">
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleEmailLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </div>

      <hr className="my-4" />

      <div className="space-y-2">
        <p className="text-center text-sm text-gray-500">또는 소셜 로그인</p>
        {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => handleSocialLogin(key)}
            className="w-full px-4 py-2 border rounded shadow hover:bg-gray-100"
          >
            {config.name}로 로그인
          </button>
        ))}
      </div>
    </div>
  );
}
