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
      <h1>Billings</h1>

      <input
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />

      <input
        type="date"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
      />

      <button onClick={handleBuscar}>Buscar</button>

      {loading && <p>Cargando...</p>}

      {err && <p>{err}</p>}

      {!loading && !err && message && data.length === 0 && <p>{message}</p>}

      {!loading && !err && data.length > 0 && <BillingsTable data={data} />}

      {!loading && !err && data.length === 0 && !message && <p>No hay datos</p>}
    </>
  );
}

export default Billings;
