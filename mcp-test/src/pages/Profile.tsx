import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다.");
          return;
        }

        const response = await axios.get("/api/v1/users/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err: any) {
        setError("유저 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>프로필</h1>
      <p>이름: {user.username}</p>
      <p>이메일: {user.email}</p>
      <p>가입일: {new Date(user.created_at).toLocaleDateString()}</p>
      <p>관리자 여부: {user.is_admin ? "✅ 예" : "❌ 아니오"}</p>
    </div>
  );
}
