import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
        }
    }, [navigate]);

    return <p className="text-center mt-10 text-gray-600">여기는 대시보드입니다.</p>;
}