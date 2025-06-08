import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

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
  const [loading, setLoading] = useState<boolean>(true);  // 로딩 상태 추가

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<User>("/api/v1/users/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 401) {
          setError("인증에 실패했습니다. 다시 로그인해주세요.");
        } else {
          setError("유저 정보를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>유저 정보가 없습니다.</div>;
  }

  return (
    <div>
      <h1>프로필</h1>
      <p>이름: {user.username}</p>
      <p>이메일: {user.email}</p>
      <p>가입일: {new Date(user.created_at).toLocaleDateString()}</p>
      <p>관리자 여부: {user.is_admin ? "예" : "아니오"}</p>
    </div>
  );
}
