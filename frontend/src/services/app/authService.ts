import authClient from "../../api/authClient";
import type { LoginForm, RegisterForm } from "../../types";
import axiosClient from "../../api/axiosClient";

export const postLogin = (form: LoginForm) => {
  return authClient.post("/auth/login", form, {
    withCredentials: true,
  });
};

export const postRegister = (form: RegisterForm) => {
  return authClient.post("/auth/register", form, {
    withCredentials: true,
  });
};

export const postLogout = () => {
  return axiosClient.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    },
  );
};
