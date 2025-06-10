import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 shadow-sm bg-white">
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold cursor-pointer"
      >
        메인페이지
      </h1>
      {user ? (
        <span className="text-gray-700">{user.username}님, 환영합니다.</span>
      ) : (
        <div>
          <button
            onClick={() => navigate("/login")}
            className="mr-2 px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200"
          >
            회원가입
          </button>
        </div>
      )}
    </header>
  );
}
