import React from "react";
import type { RegisterForm } from "../../types";

type registerFormProps = {
  form: RegisterForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

function RegisterFormulario({
  form,
  handleChange,
  handleSubmit,
}: registerFormProps) {
  return (
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
  );
}

export default RegisterFormulario;
