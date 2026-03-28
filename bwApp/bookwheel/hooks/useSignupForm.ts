import { useState } from "react";

export default function useSignupForm() {
  const [form, setForm] = useState({
    loginId: "",
    email: "",
    password: "",
    passwordCheck: "",
    emailCode: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [key]: "",
    }));
  };

  return {
    form,
    errors,
    setErrors,
    handleChange,
  };
}
