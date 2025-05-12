// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  username: string;
  email: string;
}

export function useAuth(): User | null {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/v1/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("유저 정보를 가져올 수 없습니다.");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      });
  }, [navigate]);

  return user;
}
