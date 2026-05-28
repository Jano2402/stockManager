import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { LoginForm } from "../../types";
import { postLogin } from "../../services/app/authService";
import LoginFormulario from "../../components/auth/LoginFormulario";
import { getErrorMessage } from "../../utils/app/errorHandler";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await postLogin(form);
      toast.success("Logueado correctamente.");
      navigate("/app");
    } catch (err) {
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || getErrorMessage(err));
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Ocurrió un error desconocido.");
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
    </div>
  );
}

export default Login;
