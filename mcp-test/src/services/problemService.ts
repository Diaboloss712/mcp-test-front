import axios, { AxiosError } from "axios";
import { api } from "./api";

export interface Problem {
  id: number;
  title: string;
  createdAt: string;
}

export async function fetchRecentProblems(): Promise<Problem[]> {
  try {
    const res = await axios.get<Problem[]>(api("/api/v1/problems/recent"));
    return res.data;
  } catch (err) {
    const axiosError = err as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail || "최근 문제 조회에 실패했습니다.";
    throw new Error(message);
  }
}

// 더 이상 추천할 문제가 없는 경우, 애매한 경우
export async function fetchRecommendedProblem(token: string): Promise<Problem> {
  try {
    const res = await axios.get<Problem>(api("/api/v1/problems/recommend"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    const axiosError = err as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail || "추천 문제 조회에 실패했습니다.";
    throw new Error(message);
  }
}
