import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import type { LoginForm, ErrorResponse } from "../../types";
import { postLogin } from "../../services/app/authService";
import LoginFormulario from "../../components/auth/LoginFormulario";
import { getErrorMessage } from "../../utils/app/errorHandler";

function Login() {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      await postLogin(form);

      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || getErrorMessage(err));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  return (
    <div>
      <LoginFormulario
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
