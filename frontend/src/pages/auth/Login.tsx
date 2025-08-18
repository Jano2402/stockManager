import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import authClient from "../../api/authClient";

interface LoginForm {
  username: string;
  password: string;
}

interface ErrorResponse {
  message?: string;
  // Otras propiedades que pueda devolver tu API en errores
}

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
      await authClient.post("/auth/login", form, { withCredentials: true });

      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ErrorResponse>;
        setError(
          serverError.response?.data?.message || "Error al iniciar sesión",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Iniciar sesión
        </button>
      </form>

      {error && (
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Login;
