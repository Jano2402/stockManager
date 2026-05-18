import React from "react";
import type { client, ModalState } from "../../types";

type ClientsTableProps = {
  clients: client[];
  setModalAbierto: React.Dispatch<React.SetStateAction<ModalState>>;
};

function ClientsTable({ clients, setModalAbierto }: ClientsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700/40">
      <table
        className="
      w-full
      bg-[#132238]/70
      backdrop-blur-sm
    "
      >
        <thead className="bg-[#0B1220]/80">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Id
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Cliente
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Teléfono
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Deuda
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Envases
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Bidones
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {clients.map((item) => (
            <tr
              key={item.id}
              className="
            border-t border-slate-700/30
            hover:bg-slate-800/30
            transition-colors
          "
            >
              <td className="px-6 py-4 text-slate-200">{item.id}</td>
              <td className="px-6 py-4 text-slate-50 font-medium">
                {item.nombre}
              </td>
              <td className="px-6 py-4 text-slate-300">{item.telefono}</td>
              <td
                className={
                  item.deuda > 0
                    ? "px-6 py-4 text-red-400 font-medium"
                    : "px-6 py-4 text-green-400"
                }
              >
                ${item.deuda}
              </td>
              <td className="px-6 py-4 text-slate-200">{item.cant_envases}</td>
              <td className="px-6 py-4 text-slate-200">{item.cant_bidones}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setModalAbierto({
                        type: "ActualizarCliente",
                        client: item,
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-sky-400/10 border border-sky-400/20 text-sky-300 hover:bg-sky-400/20 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setModalAbierto({ type: "AñadirCompra", client: item });
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/20 transition-all"
                  >
                    Añadir compra
                  </button>
                  <button
                    onClick={() => {
                      setModalAbierto({
                        type: "BorrarCliente",
                        client: item,
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-all"
                  >
                    Borrar cliente
                  </button>
                  <button
                    onClick={async () => {
                      setModalAbierto({
                        type: "ModificarCompra",
                        client: item,
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-700 transition-all"
                  >
                    Ver compras
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsTable;
