import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import {
  fetchRecentProblems,
  fetchRecommendedProblem,
  type Problem,
} from "../services/problemService";

export default function MainPage() {
  const user = useAuth();
  const navigate = useNavigate();
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);

  useEffect(() => {
    fetchRecentProblems()
      .then(setRecentProblems)
      .catch((err) => {
        console.error("최근 문제 불러오기 실패:", err);
      });
  }, []);

  const handleStartTest = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";
      const recommended = await fetchRecommendedProblem(token);
      navigate(`/problems/${recommended.id}`);
    } catch (error) {
      console.error("추천 문제 불러오기 실패:", error);
      alert("추천 문제를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* 중앙 영역 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-3xl font-bold mb-4">오늘의 문제 풀기</h2>
        <p className="text-gray-600 mb-8">
          AI가 엄선한 문제로 실력을 확인해보세요.
        </p>
        <button
          onClick={handleStartTest}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          시작하기
        </button>
      </main>

      {/* 하단 영역 */}
      <footer className="grid grid-cols-2 gap-4 p-6 bg-white shadow-inner">
        {/* 좌하단: 최근 문제 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">최근 출시된 문제</h3>
          <ul className="space-y-2">
            {recentProblems.map((problem) => (
              <li
                key={problem.id}
                className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                {problem.title}
              </li>
            ))}
          </ul>
        </div>

        {/* 우하단: 빈 자리 */}
        <div className="text-gray-400 text-center self-end">
          (우하단 자리 – 추후 기능 추가 예정)
        </div>
      </footer>
    </div>
  );
}
