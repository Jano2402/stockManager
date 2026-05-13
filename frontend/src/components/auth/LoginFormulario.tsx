import React from "react";
import type { LoginForm } from "../../types";

type LoginFormProps = {
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  form: LoginForm;
};

function LoginFormulario({ handleSubmit, handleChange, form }: LoginFormProps) {
  return (
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
  );
}

export default LoginFormulario;
