import React from "react";
import type { LoginForm } from "../../types";

type LoginFormProps = {
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  form: LoginForm;
};

function LoginFormulario({ handleSubmit, handleChange, form }: LoginFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="
    w-full max-w-md

    p-8

    rounded-3xl

    bg-[#132238]/80
    border border-slate-700/40

    shadow-2xl

    space-y-6
  "
    >
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="
        block

        text-sm
        font-medium

        text-slate-300
      "
        >
          Nombre de usuario
        </label>

        <input
          type="text"
          id="username"
          name="username"
          required
          value={form.username}
          onChange={handleChange}
          className="
        w-full

        px-4 py-3

        rounded-2xl

        bg-[#0B1220]
        border border-slate-700/50

        text-slate-50
        placeholder:text-slate-500

        outline-none

        transition-all duration-200

        focus:border-sky-400
        focus:ring-4 focus:ring-sky-400/10
      "
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="
        block

        text-sm
        font-medium

        text-slate-300
      "
        >
          Contraseña
        </label>

        <input
          type="password"
          id="password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
          className="
        w-full

        px-4 py-3

        rounded-2xl

        bg-[#0B1220]
        border border-slate-700/50

        text-slate-50
        placeholder:text-slate-500

        outline-none

        transition-all duration-200

        focus:border-sky-400
        focus:ring-4 focus:ring-sky-400/10
      "
        />
      </div>

      <button
        type="submit"
        className="
      w-full

      py-3

      rounded-2xl

      bg-sky-400/10
      border border-sky-400/20

      text-sky-300
      font-semibold

      hover:bg-sky-400/20
      hover:border-sky-400/40

      active:scale-[0.99]

      transition-all duration-200
    "
      >
        Iniciar sesión
      </button>
    </form>
  );
}

export default LoginFormulario;
