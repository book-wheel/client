import api from "./axios";
import type { ApiResponse } from "@/types/api";

export type SocialProvider = "NONE" | "GOOGLE" | "KAKAO";

export type MyProfile = {
  userPK: string;
  loginId: string;
  nickname: string;
  mail: string;
  social: SocialProvider;
  comment: string | null;
  // GET /users/me에서는 object key가 아닌 표시용 Presigned URL이 내려온다.
  profileImageKey: string | null;
};

// ==================== AUTH ====================

//회원가입
export const signup = (data: {
  loginId: string;
  password: string;
  mail: string;
}) => {
  return api.post("/auth/signup", data);
};

//로그인
export const login = (data: { loginId: string; password: string }) => {
  return api.post("/auth/login", data);
};

// 이메일 인증 요청
export const sendEmail = (email: string) => {
  return api.post("/auth/emails/send", {
    email,
  });
};

// 이메일 인증 확인
export const verifyEmail = (email: string, code: string) => {
  return api.post("/auth/emails/verify", {
    email,
    code,
  });
};

// ==================== USERS ====================

//프로필 설정
export const setupProfile = (data: {
  profileImageKey?: string;
  nickname: string;
  comment: string;
}) => {
  return api.patch("/users/setup-profile", data);
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = (nickname: string) => {
  return api.get("/users/check-nickname", {
    params: { nickname },
  });
};

// 아이디 찾기 - 인증번호 발송
export const sendRecoveryCode = (mail: string) => {
  return api.post("/users/recovery/send-code", {
    mail,
  });
};

// 아이디 찾기 - 인증번호 확인 후 아이디 반환
export const verifyRecoveryId = (mail: string, code: string) => {
  return api.post("/users/recovery/verify-id", {
    mail,
    code,
  });
};

// 비밀번호 변경 - 인증번호 확인 (resetToken 발급)
export const verifyRecoveryPassword = (mail: string, code: string) => {
  return api.post("/users/recovery/verify-password", {
    mail,
    code,
  });
};

// 비밀번호 변경
export const resetPassword = (resetToken: string, newPassword: string) => {
  return api.patch("/users/recovery/reset-password", {
    resetToken,
    newPassword,
  });
};

//로그아웃
export const logout = () => {
  return api.post("/users/logout");
};

//내 정보 조회
export const getMyInfo = () => {
  return api.get<ApiResponse<MyProfile>>("/users/me");
};

//회원탈퇴
export const deleteAccount = (password?: string) => {
  return api.delete<ApiResponse<null>>(
    "/users/me",
    password ? { data: { password } } : undefined,
  );
};

//토큰교환
export const exchangeOAuthCode = (data: {
  code: string;
  codeVerifier: string;
}) => {
  return api.post("/auth/oauth2/token", data);
};
