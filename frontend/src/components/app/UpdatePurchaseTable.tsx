import React from "react";
import type { compras, ModalState } from "../../types";
import Modal from "./Modal";

type UpdatePurchaseTableProps = {
  compras: compras[];
  handleEditPurchase: (item: compras) => void;
  setModalAbierto: React.Dispatch<React.SetStateAction<ModalState>>;
};

function UpdatePurchaseTable({
  compras,
  handleEditPurchase,
  setModalAbierto,
}: UpdatePurchaseTableProps) {
  return (
    <Modal
      title={"Compras del cliente"}
      onClose={() => setModalAbierto({ type: "NONE" })}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-200">
            Historial de compras
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Consultá y modificá las compras registradas.
          </p>
        </div>

        <div
          className="
            overflow-x-auto
            rounded-2xl
            border border-slate-700/40
            custom-scrollbar
          "
        >
          <table
            className="
              w-full
              bg-[#0B1220]/40
            "
          >
            <thead className="bg-[#0B1220]/80">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Id
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Sifones
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Bidones 6L
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Bidones 12L
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Devuelve sifones
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Devuelve bidones
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Pago
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Fecha
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {compras.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-t border-slate-700/30
                    hover:bg-slate-800/20
                    transition-colors
                  "
                >
                  <td className="px-5 py-4 text-slate-200">
                    {item.cliente_id}
                  </td>

                  <td className="px-5 py-4 text-slate-200">{item.sifones}</td>

                  <td className="px-5 py-4 text-slate-200">
                    {item.bidones_6l}
                  </td>

                  <td className="px-5 py-4 text-slate-200">
                    {item.bidones_12l}
                  </td>

                  <td className="px-5 py-4 text-slate-200">
                    {item.devuelveSif}
                  </td>

                  <td className="px-5 py-4 text-slate-200">
                    {item.devuelveBid}
                  </td>

                  <td className="px-5 py-4 text-emerald-300 font-medium">
                    ${item.pago}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {new Date(item.fecha).toLocaleDateString("es-UY")}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleEditPurchase(item)}
                      className="
                        px-4 py-2

                        rounded-xl

                        bg-sky-400/10
                        border border-sky-400/20

                        text-sky-300
                        font-medium

                        hover:bg-sky-400/20
                        hover:border-sky-400/40

                        transition-all duration-200
                      "
                    >
                      Modificar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setModalAbierto({ type: "NONE" });
            }}
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
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default UpdatePurchaseTable;
