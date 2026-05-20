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
          minLength={3}
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
          minLength={6}
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

          bg-emerald-400/10
          border border-emerald-400/20

          text-emerald-300
          font-semibold

          hover:bg-emerald-400/20
          hover:border-emerald-400/40

          active:scale-[0.99]

          transition-all duration-200
        "
      >
        Registrarse
      </button>
    </form>
  );
}

export default RegisterFormulario;
