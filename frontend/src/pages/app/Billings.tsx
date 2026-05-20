import React, { useState } from "react";
import type { compraAgrupada } from "../../types";
import BillingsTable from "../../components/app/BillingsTable";
import { getComprasAgrupadas } from "../../services/app/billingsService";

function Billings() {
  const [data, setData] = useState<compraAgrupada[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const handleBuscar = async () => {
    if (!fechaInicio || !fechaFin) {
      setErr("Seleccioná ambas fechas");
      return;
    }

    if (fechaInicio > fechaFin) {
      setErr("La fecha inicio no puede ser mayor a la fecha fin");
      return;
    }

    setLoading(true);
    setErr(null);
    setMessage(null);

    try {
      const res = await getComprasAgrupadas(fechaInicio, fechaFin);

      setData(res.data.data);
      setMessage(res.data.message);
    } catch (err: any) {
      setErr(err.message);
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

        {loading && <p className="text-center text-slate-400">Cargando...</p>}

        {err && <p className="text-center text-red-400">{err}</p>}

        {!loading && !err && message && data.length === 0 && (
          <p className="text-center text-slate-400">{message}</p>
        )}

        {!loading && !err && data.length > 0 && <BillingsTable data={data} />}

        {!loading && !err && data.length === 0 && !message && (
          <p className="text-center text-slate-400">No hay datos</p>
        )}
      </div>
    </>
  );
}

export default Billings;
