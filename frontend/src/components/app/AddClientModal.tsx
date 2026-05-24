import React from "react";
import type { Cliente } from "../../types";
import Modal from "./Modal";

type AddClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading: boolean;
};

function AddClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
  loading,
}: AddClientModalProps) {
  return (
    <Modal title={"Añadir cliente"} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label
            className="
              block
              mb-2
              text-sm
              font-medium
              text-slate-300
            "
          >
            Nombre
          </label>

          <input
            type="text"
            placeholder="Nombre"
            value={cliente.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            disabled={loading}
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

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          />
        </div>

        <div>
          <label
            className="
              block
              mb-2
              text-sm
              font-medium
              text-slate-300
            "
          >
            Teléfono
          </label>

          <input
            type="text"
            placeholder="Teléfono"
            value={cliente.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            disabled={loading}
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

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="
              min-w-[160px]

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
              "Añadir cliente"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddClientModal;
