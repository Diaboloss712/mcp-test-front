import { useEffect, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithOAuthCode } from "../services/authService";
import { CustomOAuthError } from "../errors/CustomOAuthError";

export default function Callback(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const HandleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        alert("잘못된 접근입니다.");
        return;
      }

      let provider: string | null = null;

      try {
        const decoded = JSON.parse(atob(state));
        provider = decoded.provider;
      } catch {
        alert("유효하지 않은 state 값입니다.");
        return;
      }

      try {
        const data = await loginWithOAuthCode(code, provider as string);
        localStorage.setItem("token", data.access_token || "");
        navigate("/dashboard");
      } catch (err) {
        if (err instanceof CustomOAuthError) {
          navigate(`/register?email=${err.email}&provider=${err.provider}`);
          return;
        }

        alert(err instanceof Error ? err.message : "로그인 실패");
      }
    };

    HandleOAuthCallback();
  }, [navigate, searchParams]);

  return (
    <p className="text-center mt-10 text-gray-600">로그인 처리 중입니다...</p>
  );
}
