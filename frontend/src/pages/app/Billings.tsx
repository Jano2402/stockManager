import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { compraAgrupada, ApiResponse } from "../../types";

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
      const res = await axiosClient.get<ApiResponse>(
        "http://localhost:3000/app/billings/purchases",
        {
          params: { fechaInicio, fechaFin },
          withCredentials: true,
        },
      );

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

      {!loading && !err && data.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sifones</th>
                <th>Bidón 6L</th>
                <th>Bidón 12L</th>
                <th>Total Compra</th>
                <th>Total Pagado</th>
                <th>Debe</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.sifones}</td>
                  <td>{item.bidon6L}</td>
                  <td>{item.bidon12L}</td>
                  <td>{item.totalCompra}</td>
                  <td>{item.totalPagado}</td>
                  <td>{item.totalDebiendo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !err && data.length === 0 && !message && <p>No hay datos</p>}
    </>
  );
}

export default Billings;
