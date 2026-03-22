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

export const logout = () => {
  return api.post("/auth/logout");
};
