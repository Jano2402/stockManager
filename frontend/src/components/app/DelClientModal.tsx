import React from "react";
import Modal from "./Modal";
import type { Cliente } from "../../types";

type DelClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function DelClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
}: DelClientModalProps) {
  return (
    <Modal title={"Borrar Cliente"} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-red-300">Eliminar cliente</h3>

          <p className="text-sm text-slate-400 mt-1">
            Esta acción no se puede deshacer.
          </p>
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

          focus:border-red-400
          focus:ring-4 focus:ring-red-400/10
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

          focus:border-red-400
          focus:ring-4 focus:ring-red-400/10
        "
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="
          px-5 py-3

          rounded-xl

          bg-slate-700/40
          border border-slate-600/40

          text-slate-200
          font-medium

          hover:bg-slate-700/70

          transition-all duration-200
        "
          >
            Cancelar
          </button>

          <button
            onClick={onSubmit}
            className="
          px-5 py-3

          rounded-xl

          bg-red-500/10
          border border-red-500/20

          text-red-300
          font-semibold

          hover:bg-red-500/20
          hover:border-red-500/40

          transition-all duration-200
        "
          >
            Borrar cliente
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DelClientModal;
