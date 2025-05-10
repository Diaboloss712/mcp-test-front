import type { JSX } from "react";

const PROVIDER_CONFIG: Record<string, { name: string; authUrl: string }> = {
  google: {
    name: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  },
  github: {
    name: "GitHub",
    authUrl: "https://github.com/login/oauth/authorize",
  },
  kakao: {
    name: "Kakao",
    authUrl: "https://kauth.kakao.com/oauth/authorize",
  },
  naver: {
    name: "Naver",
    authUrl: "https://nid.naver.com/oauth2.0/authorize",
  },
};

export default function Login(): JSX.Element {
  const handleSocialLogin = (provider: string) => {
    const config = PROVIDER_CONFIG[provider];
    const clientId = import.meta.env[`VITE_${provider.toUpperCase()}_CLIENT_ID`];
    const redirectUri = `${import.meta.env.VITE_REDIRECT_URI}?provider=${provider}`;

    const authUrl =
      `${config.authUrl}?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=email%20profile`;

    window.location.href = authUrl;
  };

  return (
    <div className="text-center mt-20 space-y-4">
      <h2 className="text-xl font-semibold mb-4">소셜 로그인</h2>

      {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
        <button
          key={key}
          onClick={() => handleSocialLogin(key)}
          className="px-4 py-2 border rounded shadow hover:bg-gray-100 w-48 block mx-auto"
        >
          {config.name}로 로그인
        </button>
      ))}
    </div>
  );
}
