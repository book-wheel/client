import api from "./axios";

export const signup = (data: {
  userId: string;
  password: string;
  nickname?: string;
  mail: string;
  comment?: string;
}) => {
  return api.post("/users/signup", data);
};

export const login = (data: any) => {
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
