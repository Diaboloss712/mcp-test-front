import { useEffect, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface AuthResponse {
  access_token?: string;
  [key: string]: unknown;
}

export default function Callback(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const provider = searchParams.get("provider");

      if (!code || !provider) {
        alert("잘못된 접근입니다.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/v1/users/social-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ provider, code }),
        });

        if (response.ok) {
          const data: AuthResponse = await response.json();

          if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            alert("Login Success");
            navigate("/dashboard");
          } else {
            alert("로그인 실패: 토큰 없음");
          }
        } else if (response.status === 404) {
          // 유저 정보 없음 → 회원가입 페이지로 이동
          if (response.status === 404) {
            const data = await response.json();
            navigate(`/register?email=${encodeURIComponent(data.email)}&provider=${data.provider}`);
          }
        } else {
          throw new Error(`예상하지 못한 상태 코드: ${response.status}`);
        }
      } catch (error) {
        console.error("OAuth 처리 중 오류:", error);
        alert("OAuth 로그인 처리 중 오류 발생");
      }
    };

    handleOAuthCallback();
  }, [navigate, searchParams]);

  return <p className="text-center mt-10 text-gray-600">로그인 처리 중입니다...</p>;
}
