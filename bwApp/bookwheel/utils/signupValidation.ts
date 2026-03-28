export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).+$/;

export const validateSignup = ({
  emailVerified,
  password,
  passwordCheck,
  agreeTerms,
  agreePrivacy,
}: {
  emailVerified: boolean;
  password: string;
  passwordCheck: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}) => {
  const errors: any = {};

  if (!emailVerified) {
    errors.email = "이메일 인증이 필요합니다";
  }

  if (!passwordRegex.test(password)) {
    errors.password = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다";
  }

  if (password !== passwordCheck) {
    errors.passwordCheck = "비밀번호가 일치하지 않습니다";
  }

  if (!agreeTerms || !agreePrivacy) {
    errors.terms = "약관 동의가 필요합니다";
  }

  return errors;
};
