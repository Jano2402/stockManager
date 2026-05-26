import React from "react";
import Modal from "./Modal";
import type { Cliente } from "../../types";

type DelClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
};

function DelClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
  loading = false,
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
            disabled={loading}
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
            type="number"
            placeholder="Teléfono"
            disabled={loading}
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

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-5 py-3

              rounded-xl

              bg-slate-700/40
              border border-slate-600/40

              text-slate-200
              font-medium

              hover:bg-slate-700/70

              transition-all duration-200

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Cancelar
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="
              min-w-[170px]

              px-5 py-3

              rounded-xl

              bg-red-500/10
              border border-red-500/20

              text-red-300
              font-semibold

              hover:bg-red-500/20
              hover:border-red-500/40

              transition-all duration-200

              disabled:opacity-50
              disabled:cursor-not-allowed

              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <div
                  className="
                    w-4 h-4

                    rounded-full

                    border-2 border-red-300/30
                    border-t-red-300

                    animate-spin
                  "
                />
                Borrando...
              </>
            ) : (
              "Borrar cliente"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DelClientModal;
