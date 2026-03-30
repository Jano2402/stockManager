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

type Compra = {
  sifones?: number;
  bidones_6l?: number;
  bidones_12l?: number;
  pago?: number;
  devuelveSif?: number;
  devuelveBid?: number;
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
  const [sifones, setSifones] = useState<string>("");
  const [bidones_6l, setBidones6l] = useState<string>("");
  const [bidones_12l, setBidones12l] = useState<string>("");
  const [pago, setPago] = useState<string>("");
  const [devuelveBid, setDevuelveBid] = useState<string>("");
  const [devuelveSif, setDevuelveSif] = useState<string>("");

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

          <label>Id</label>
          <input
            type="number"
            placeholder="Id"
            value={id}
            onChange={(e) => setId(parseInt(e.target.value))}
          />

          <label>Sifones</label>
          <input
            type="text"
            placeholder="sifones"
            value={sifones}
            onChange={(e) => setSifones(e.target.value)}
          />

          <label>Bidones 6l</label>
          <input
            type="text"
            placeholder="Bidones 6l"
            value={bidones_6l}
            onChange={(e) => setBidones6l(e.target.value)}
          />

          <label>Bidones 12l</label>
          <input
            type="number"
            placeholder="Bidones 12l"
            value={bidones_12l}
            onChange={(e) => setBidones12l(e.target.value)}
          />

          <label>Pago</label>
          <input
            type="number"
            placeholder="Pago"
            value={pago}
            onChange={(e) => setPago(e.target.value)}
          />

          <label>Sifones que devuelve</label>
          <input
            type="number"
            placeholder="Sifones que devuelve"
            value={devuelveSif}
            onChange={(e) => setDevuelveSif(e.target.value)}
          />

          <label>Bidones que devuelve</label>
          <input
            type="number"
            placeholder="Bidones que devuelve"
            value={devuelveBid}
            onChange={(e) => setDevuelveBid(e.target.value)}
          />

          <button
            onClick={async () => {
              const data: Compra = {
                ...(sifones !== "" && { sifones: Number(sifones) }),
                ...(bidones_6l !== "" && { bidones_6l: Number(bidones_6l) }),
                ...(bidones_12l !== "" && { bidones_12l: Number(bidones_12l) }),
                ...(pago !== "" && { pago: Number(pago) }),
                ...(devuelveSif !== "" && { devuelveSif: Number(devuelveSif) }),
                ...(devuelveBid !== "" && { devuelveBid: Number(devuelveBid) }),
              };

              try {
                await axiosClient.post(
                  `http://localhost:3000/app/clients/${id}/purchases`,
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

      {/* {!loading && !err && modalAbierto === "Modificar compra" && ()} -> Implementar como un modal que muestre
      todas las compras y ponga opcion para editarlas */}

      {!loading && !err && modalAbierto === "BorrarCliente" && (
        <div>
          <h3>Borrar Cliente</h3>

          <label>Id</label>
          <input
            type="number"
            placeholder="Id"
            value={id}
            onChange={(e) => setId(parseInt(e.target.value))}
          />

          {/* Añadir verificación de cliente, que pongo el id del cliente, el numero y el telefono, y que
          el backend verifique que todo coincida para luego borrar */}

          <button
            onClick={async () => {
              try {
                await axiosClient.delete(
                  `http://localhost:3000/app/clients/${id}/delete`,
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
