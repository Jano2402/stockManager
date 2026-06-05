import type { compraAgrupada } from "../../types";

type BillingsTableProps = {
  data: compraAgrupada[];
};

function BillingsTable({ data }: BillingsTableProps) {
  const totalCompra: number = data.reduce(
    (acc, item) => acc + item.totalCompra,
    0,
  );

  const totalPagado: number = data.reduce(
    (acc, item) => acc + item.totalPagado,
    0,
  );

  const totalDebiendo: number = data.reduce(
    (acc, item) => acc + item.totalDebiendo,
    0,
  );
  return (
    <div
      className="
        overflow-x-auto

        rounded-3xl

        border border-slate-700/40

        bg-[#132238]/70
        custom-scrollbar
      "
    >
      <table
        className="w-full 
          animate-in
          fade-in
          zoom-in-95
          duration-200"
      >
        <thead
          className="
          bg-[#0B1220]/80
            border-b border-slate-700/40
          "
        >
          <tr>
            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Cliente
            </th>

            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Sifones
            </th>

            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Bidón 6L
            </th>

            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Bidón 12L
            </th>

            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Total Compra
            </th>

            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Total Pagado
            </th>

            <th
              className="
                px-6 py-4
                text-left
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Debe
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700/20">
          {data.map((item, index) => (
            <tr
              key={index}
              className="
              hover:bg-slate-800/20
                transition-colors duration-200
              "
            >
              <td
                className="
                  px-6 py-4

                text-slate-50
                  font-medium
                "
              >
                {item.nombre}
              </td>

              <td className="px-6 py-4 text-slate-200">{item.sifones}</td>

              <td className="px-6 py-4 text-slate-200">{item.bidon6L}</td>

              <td className="px-6 py-4 text-slate-200">{item.bidon12L}</td>

              <td
                className="
                  px-6 py-4

                  text-sky-300
                  font-medium
                "
              >
                ${item.totalCompra}
              </td>

              <td
                className="
                  px-6 py-4

                  text-emerald-300
                  font-medium
                "
              >
                ${item.totalPagado}
              </td>

              <td
                className={`
                  px-6 py-4
                  font-semibold

                  ${item.totalDebiendo > 0 ? "text-red-400" : "text-emerald-400"}
                `}
              >
                ${item.totalDebiendo}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-slate-700/40 bg-[#0B1220]/80">
          <tr>
            <td
              colSpan={4}
              className="
                px-6 py-4
                text-right
                font-semibold
                text-slate-300
              "
            >
              Totales
            </td>

            <td className="px-6 py-4 font-semibold text-sky-300">
              ${totalCompra}
            </td>

            <td className="px-6 py-4 font-semibold text-emerald-300">
              ${totalPagado}
            </td>

            <td
              className={`px-6 py-4 font-semibold ${
                totalDebiendo > 0 ? "text-red-400" : "text-emerald-400"
              }`}
            >
              ${totalDebiendo}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default BillingsTable;
