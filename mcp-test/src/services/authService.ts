import axios, { AxiosError } from "axios";
import { api } from "./api";
import { CustomOAuthError } from "../errors/CustomOAuthError";

export interface AuthResponse {
  access_token?: string;
  email?: string;
  provider?: string;
  [key: string]: unknown;
}

export interface RegisterResponse {
  access_token: string;
}

interface NotRegisteredDetail {
  message?: string;
  email?: string;
  provider?: string;
}

export async function loginWithOAuthCode(
  code: string,
  provider: string
): Promise<AuthResponse> {
  try {
    const res = await axios.post<AuthResponse>(
      api("/api/v1/users/social-login"),
      { provider, code }
    );
    return res.data;
  } catch (err) {
    const axiosError = err as AxiosError<{ detail?: NotRegisteredDetail }>;
    const detail = axiosError.response?.data?.detail;

    if (
      axiosError.response?.status === 404 &&
      detail?.email &&
      detail?.provider
    ) {
      throw new CustomOAuthError(
        detail.message ?? "User not registered",
        404,
        detail.email,
        detail.provider
      );
    }

    throw new Error("소셜 로그인에 실패했습니다.");
  }
}

export async function registerWithSocialInfo(
  email: string,
  provider: string,
  username: string
): Promise<RegisterResponse> {
  try {
    const response = await axios.post<RegisterResponse>(
      api("/api/v1/users/social-register"),
      { email, provider, username }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail || "알 수 없는 오류";
    throw new Error(message);
  }
}
