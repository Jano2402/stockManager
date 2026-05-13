import authClient from "../../api/authClient";
import type { LoginForm, RegisterForm } from "../../types";
import axiosClient from "../../api/axiosClient";

export const postLogin = (form: LoginForm) => {
  authClient.post("/auth/login", form, { withCredentials: true });
};

export const postRegister = (form: RegisterForm) => {
  authClient.post("/auth/register", form, { withCredentials: true });
};

export const postLogout = () => {
  axiosClient.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    },
  );
};
