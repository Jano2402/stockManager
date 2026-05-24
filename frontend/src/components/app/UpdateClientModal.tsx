import React from "react";
import Modal from "./Modal";
import type { Cliente } from "../../types";

type UpdateClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading: boolean;
};

const inputStyles = `
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

  disabled:opacity-50
  disabled:cursor-not-allowed
`;

function UpdateClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
  loading,
}: UpdateClientModalProps) {
  return (
    <Modal title={"Actualizar Cliente"} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Nombre
          </label>

          <input
            type="text"
            placeholder="Nombre"
            value={cliente.nombre}
            disabled={loading}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Teléfono
          </label>

          <input
            type="text"
            placeholder="Teléfono"
            value={cliente.telefono}
            disabled={loading}
            onChange={(e) => handleChange("telefono", e.target.value)}
            className={inputStyles}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Deuda
            </label>

            <input
              type="number"
              placeholder="Deuda"
              value={cliente.deuda}
              disabled={loading}
              onChange={(e) => handleChange("deuda", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Envases
            </label>

            <input
              type="number"
              placeholder="Cantidad de envases"
              value={cliente.cant_envases}
              disabled={loading}
              onChange={(e) => handleChange("cant_envases", e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Cantidad de bidones
          </label>

          <input
            type="number"
            placeholder="Cantidad de bidones"
            value={cliente.cant_bidones}
            disabled={loading}
            onChange={(e) => handleChange("cant_bidones", e.target.value)}
            className={inputStyles}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="
              min-w-[180px]

              flex items-center justify-center gap-2

              px-5 py-3

              rounded-xl

              bg-sky-400/10
              border border-sky-400/20

              text-sky-300
              font-semibold

              hover:bg-sky-400/20
              hover:border-sky-400/40

              transition-all duration-200

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <div
                  className="
                    w-4 h-4

                    rounded-full

                    border-2 border-sky-300/30
                    border-t-sky-300

                    animate-spin
                  "
                />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default UpdateClientModal;
