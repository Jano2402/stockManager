import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

interface client {
  id: number;
  nombre: string;
  telefono: string;
  deuda: number;
  cant_envases: number;
  cant_bidones: number;
}

type UpdateClientData = {
  nombre?: string;
  telefono?: string;
  deuda?: number;
  cant_envases?: number;
  cant_bidones?: number;
};

function Clients() {
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [clients, setClients] = useState<client[]>([]);
  const [actualizar, setActualizar] = useState<number>(0);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);

  const [id, setId] = useState<number>(-1);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [deuda, setDeuda] = useState<string>("");
  const [cant_envases, setCantEnvases] = useState<string>("");
  const [cant_bidones, setCantBidones] = useState<string>("");

  useEffect(() => {
    axiosClient
      .get<client[]>("http://localhost:3000/app/clients/get")
      .then((res) => {
        setClients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [actualizar]);

  return (
    <>
      <h1>Clientes</h1>
      {!loading && !err && clients.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Deuda</th>
                <th>Cantidad de envases</th>
                <th>Cantidad de bidones</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.telefono}</td>
                  <td>{item.deuda}</td>
                  <td>{item.cant_envases}</td>
                  <td>{item.cant_bidones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !err && clients.length === 0 && <p>No hay clientes</p>}

      {err && <p>{err}</p>}

      {loading && <p>Cargando...</p>}

      {/* Modales */}

      {!loading && !err && modalAbierto === "AñadirCliente" && (
        <div>
          <h3>Añadir cliente</h3>

          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <button
            onClick={async () => {
              try {
                await axiosClient.post(
                  "http://localhost:3000/app/clients/init",
                  { nombre, telefono },
                  { withCredentials: true },
                );

                setNombre("");
                setTelefono("");

                setActualizar((prev) => prev + 1);
              } catch (error: any) {
                setError(error.message);
              }
            }}
          >
            Añadir
          </button>
          <button onClick={() => setModalAbierto(null)}>Cerrar</button>
        </div>
      )}

      {!loading && !err && modalAbierto === "ActualizarCliente" && (
        <div>
          <h3>Actualizar Cliente</h3>

          <label>Id</label>
          <input
            type="number"
            placeholder="Id"
            value={id}
            onChange={(e) => setId(parseInt(e.target.value))}
          />

          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <label>Deuda</label>
          <input
            type="number"
            placeholder="Deuda"
            value={deuda}
            onChange={(e) => setDeuda(e.target.value)}
          />

          <label>Cantidad de envases</label>
          <input
            type="number"
            placeholder="Cantidad de envases"
            value={cant_envases}
            onChange={(e) => setCantEnvases(e.target.value)}
          />

          <label>Cantidad de bidones</label>
          <input
            type="number"
            placeholder="Cantidad de bidones"
            value={cant_bidones}
            onChange={(e) => setCantBidones(e.target.value)}
          />

          <button
            onClick={async () => {
              const data: UpdateClientData = {
                ...(nombre !== "" && { nombre }),
                ...(telefono !== "" && { telefono }),
                ...(deuda !== "" && { deuda: Number(deuda) }),
                ...(cant_envases !== "" && {
                  cant_envases: Number(cant_envases),
                }),
                ...(cant_bidones !== "" && {
                  cant_bidones: Number(cant_bidones),
                }),
              };

              try {
                await axiosClient.put(
                  `http://localhost:3000/app/clients/${id}/modify`,
                  data,
                  { withCredentials: true },
                );

                setNombre("");
                setTelefono("");
                setDeuda("");
                setCantEnvases("");
                setCantBidones("");

                setActualizar((prev) => prev + 1);
              } catch (error: any) {
                setError(error.message);
              }
            }}
          >
            Aceptar
          </button>
          <button onClick={() => setModalAbierto(null)}>Cerrar</button>
        </div>
      )}

      {/* {!loading && !err && modalAbierto === "Buscar Cliente" && ()} -> Implementar como una barra de búsqueda */}

      {!loading && !err && modalAbierto === "AñadirCompra" && (
        <div>
          <h3>Añadir compra</h3>
        </div>
      )}

      {/* Modales Fin */}

      <button onClick={() => setModalAbierto("AñadirCliente")}>
        Añadir cliente
      </button>
      <button onClick={() => setModalAbierto("ActualizarCliente")}>
        Actualizar Cliente
      </button>
      <button onClick={() => setModalAbierto("BuscarCliente")}>
        Buscar cliente
      </button>
      <button onClick={() => setModalAbierto("AñadirCompra")}>
        Añadir compra
      </button>
      <button onClick={() => setModalAbierto("ModificarCompra")}>
        Modificar compra
      </button>
      <button onClick={() => setModalAbierto("BorrarCliente")}>
        Borrar Cliente
      </button>
    </>
  );
}

export default Clients;
