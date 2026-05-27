import { useState } from "react";
import type { compraAgrupada } from "../../types";
import BillingsTable from "../../components/app/BillingsTable";
import { getComprasAgrupadas } from "../../services/app/billingsService";
import { getErrorMessage } from "../../utils/app/errorHandler";
import toast from "react-hot-toast";

function Billings() {
  const [data, setData] = useState<compraAgrupada[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const handleBuscar = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error("Seleccioná ambas fechas.");
      return;
    }

    if (fechaInicio > fechaFin) {
      toast.error("La fecha inicio no puede ser mayor a la fecha fin.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await getComprasAgrupadas(fechaInicio, fechaFin);
      const compras = res.data.data;

      setData(compras);
      setMessage(res.data.message);
      if (compras.length === 0) {
        toast("No hay compras en ese rango de fechas.");
      } else {
        toast.success("Compras obtenidas.");
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-center">
          <h1 className="text-4xl font-semibold text-slate-50">Billings</h1>
        </div>

        <div
          className="
            max-w-2xl
            mx-auto

            p-8

            rounded-3xl

            bg-[#132238]/70
            border border-slate-700/40
          "
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                  Desde
                </label>

                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="
                    w-[220px]

                    px-4 py-3

                    rounded-2xl

                    bg-[#0B1220]
                    border border-slate-700/50

                    text-slate-50

                    outline-none

                    transition-all duration-200

                    focus:border-sky-400
                    focus:ring-4 focus:ring-sky-400/10

                    [color-scheme:dark]
                  "
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                  Hasta
                </label>

                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="
                    w-[220px]

                    px-4 py-3

                    rounded-2xl

                    bg-[#0B1220]
                    border border-slate-700/50

                    text-slate-50

                    outline-none

                    transition-all duration-200

                    focus:border-sky-400
                    focus:ring-4 focus:ring-sky-400/10

                    [color-scheme:dark]
                  "
                />
              </div>
            </div>

            <button
              onClick={handleBuscar}
              className="
                h-[52px]

                px-8

                rounded-2xl

                bg-sky-400/10
                border border-sky-400/20

                text-sky-300
                font-semibold

                hover:bg-sky-400/20
                hover:border-sky-400/40

                transition-all duration-200
              "
            >
              Buscar
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div
              className="
              w-10 h-10

              rounded-full

              border-4 border-slate-700
              border-t-sky-400

              animate-spin
            "
            />

            <p className="text-slate-400 text-md">Cargando...</p>
          </div>
        )}

        {!loading && data.length > 0 && <BillingsTable data={data} />}

        {!loading && data.length === 0 && !message && (
          <p className="text-center text-slate-400">No hay datos</p>
        )}
      </div>
    </>
  );
}

export default Billings;
