import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";

interface RegisterResponse {
  access_token: string;
}

export default function Register(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const provider = searchParams.get("provider");

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !provider) {
      setError("유효하지 않은 접근입니다.");
    }
  }, [email, provider]);

  const handleSubmit = async () => {
    if (!username) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/social-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, provider, username }),
      });

      const data: RegisterResponse = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError("회원가입 실패: " + (data as unknown as { detail: string })?.detail || "알 수 없는 오류");
      }
    } catch (err) {
      console.error(err);
      setError("서버 오류로 회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">소셜 회원가입</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-2 font-medium">닉네임</label>
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
        회원가입 완료
      </button>
    </div>
  );
}
