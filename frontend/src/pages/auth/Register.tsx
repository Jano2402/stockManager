import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import authClient from "../../api/authClient";

interface RegisterForm {
  username: string;
  password: string;
}

interface ErrorResponse {
  message?: string;
  // Puedes añadir otras propiedades que devuelva tu API en errores
}

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
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      await authClient.post("/auth/register", form, { withCredentials: true });

      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ErrorResponse>;
        setError(
          serverError.response?.data?.message || "Error registrando usuario",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            minLength={3}
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
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Registrarse
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

export default Register;
