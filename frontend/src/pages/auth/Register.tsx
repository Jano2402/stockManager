import React, { useState } from "react";
import authClient from "../../api/authClient";

interface RegisterForm {
  username: string;
  password: string;
}

function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await authClient.post("/auth/register", form, {
        withCredentials: true,
      });

      window.location.href = "/";
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Error registrando usuario");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="username"
          required
          value={form.username}
          onChange={handleChange}
        />

        <label htmlFor="contraseña">Contraseña:</label>
        <input
          type="password"
          id="contraseña"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Enviar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default Register;
