import api from "./axios";

export const signup = (data: {
  loginId: string;
  password: string;
  mail: string;
}) => {
  return api.post("/auth/signup", data);
};

//프로필 설정
export const setupProfile = (data: {
  profileImageKey?: string;
  nickname: string;
  comment: string;
}) => {
  return api.patch("/users/setup-profile", data);
};

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

// 아이디 찾기 - 인증번호 발송
export const sendRecoveryCode = (mail: string) => {
  return api.post("/api/v1/users/recovery/send-code", {
    mail,
  });
};

// 아이디 찾기 - 인증번호 확인 후 아이디 반환
export const verifyRecoveryId = (mail: string, code: string) => {
  return api.post("/api/v1/users/recovery/verify-id", {
    mail,
    code,
  });
};

// 비밀번호 변경 - 인증번호 확인 (resetToken 발급)
export const verifyRecoveryPassword = (mail: string, code: string) => {
  return api.post("/api/v1/users/recovery/verify-password", {
    mail,
    code,
  });
};

// 비밀번호 변경
export const resetPassword = (resetToken: string, newPassword: string) => {
  return api.post("/api/v1/users/recovery/reset-password", {
    resetToken,
    newPassword,
  });
};

//로그아웃
export const logout = () => {
  return api.post("/auth/logout");
};
