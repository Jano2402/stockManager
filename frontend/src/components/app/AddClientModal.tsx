import React from "react";
import type { Cliente } from "../../types";
import Modal from "./Modal";

type AddClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function AddClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
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

        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            className="
              px-5 py-3

              rounded-xl

              bg-sky-400/10
              border border-sky-400/20

              text-sky-300
              font-semibold

              hover:bg-sky-400/20
              hover:border-sky-400/40

              transition-all duration-200
            "
          >
            Añadir cliente
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddClientModal;
