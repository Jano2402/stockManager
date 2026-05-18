import React from "react";
import type { Cliente } from "../../types";
import Modal from "./Modal";

type AnadirCompraModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function AnadirCompraModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
}: AnadirCompraModalProps) {
  return (
    <Modal title={"Añadir Compra"} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-200">
            Registrar compra
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Añadí los productos y el pago realizado.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
              Sifones
            </label>

            <input
              type="number"
              placeholder="0"
              value={cliente.sifones}
              onChange={(e) => handleChange("sifones", e.target.value)}
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
              Bidones 6L
            </label>

            <input
              type="number"
              placeholder="0"
              value={cliente.bidones_6l}
              onChange={(e) => handleChange("bidones_6l", e.target.value)}
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
              Bidones 12L
            </label>

            <input
              type="number"
              placeholder="0"
              value={cliente.bidones_12l}
              onChange={(e) => handleChange("bidones_12l", e.target.value)}
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
            Pago
          </label>

          <input
            type="number"
            placeholder="$0"
            value={cliente.pago}
            onChange={(e) => handleChange("pago", e.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
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
              Sifones que devuelve
            </label>

            <input
              type="number"
              placeholder="0"
              value={cliente.devuelveSif}
              onChange={(e) => handleChange("devuelveSif", e.target.value)}
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
              Bidones que devuelve
            </label>

            <input
              type="number"
              placeholder="0"
              value={cliente.devuelveBid}
              onChange={(e) => handleChange("devuelveBid", e.target.value)}
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
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            className="
          px-5 py-3

          rounded-xl

          bg-emerald-400/10
          border border-emerald-400/20

          text-emerald-300
          font-semibold

          hover:bg-emerald-400/20
          hover:border-emerald-400/40

          transition-all duration-200
        "
          >
            Registrar compra
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AnadirCompraModal;
