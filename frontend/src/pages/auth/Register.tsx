import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import type { RegisterForm, ErrorResponse } from "../../types";
import RegisterFormulario from "../../components/auth/RegisterFormulario";
import { postRegister } from "../../services/app/authService";
import { getErrorMessage } from "../../utils/app/errorHandler";

function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // Pasa por segunda vez uno de los parámetros, y JS siempre que lo pasas dos veces toma el último.
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      await postRegister(form);

      window.location.href = "/";
    } catch (err) {
      console.error("Registration error:", err);

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
      <RegisterFormulario
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;
