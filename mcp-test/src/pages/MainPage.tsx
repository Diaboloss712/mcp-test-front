import { useAuth } from "../hooks/useAuth";

export default function MainPage() {
  const user = useAuth();

  return (
    <div className="text-center mt-10">
      <h1>메인페이지</h1>
      {user ? (
        <p>{user.username}님, 환영합니다.</p>
      ) : (
        <p>로그인된 사용자가 없습니다.</p>
      )}
    </div>
  );
}
