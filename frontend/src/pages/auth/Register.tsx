import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import type { RegisterForm, ErrorResponse } from "../../types";
import RegisterFormulario from "../../components/auth/RegisterFormulario";
import { postRegister } from "../../services/app/authService";
import { getErrorMessage } from "../../utils/app/errorHandler";
import toast from "react-hot-toast";

function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // Pasa por segunda vez uno de los parámetros, y JS siempre que lo pasas dos veces toma el último.
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await postRegister(form);
      toast.success("Registrado correctamente.");
      window.location.href = "/";
    } catch (err) {
      console.error("Registration error:", err);

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
      <RegisterFormulario
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Register;
