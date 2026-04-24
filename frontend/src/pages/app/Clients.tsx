import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { client, UpdateClientData, Compra, compras } from "../../types";

function Clients() {
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [clients, setClients] = useState<client[]>([]);
  const [actualizar, setActualizar] = useState<number>(0);
  const [actualizarCompra, setActualizarCompra] = useState<number>(0);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [compras, setCompras] = useState<compras[]>([]);

  // const [id, setId] = useState<number | undefined>(-1);
  const [buscar, setBuscar] = useState<string>("");
  const [selectedCliente, setSelectedClient] = useState<client | null>(null);
  const [compraSeleccionada, setCompraSeleccionada] = useState<compras | null>(
    null,
  );
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
    const controller = new AbortController();

    if (buscar === "") {
      axiosClient
        .get<client[]>("http://localhost:3000/app/clients/get")
        .then((res) => {
          setClients(res.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") setError(err.message);
          setLoading(false);
        });
      return () => controller.abort();
    }

    if (buscar.length < 3) return;

    const timeout = setTimeout(() => {
      axiosClient
        .get<client[]>(
          `http://localhost:3000/app/clients/search?nombre=${buscar}&limit=10`,
          //{ signal: controller.signal }, Descomentar y probar
        )
        .then((res) => {
          setClients(res.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") setError(err.message);
          setLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [actualizar, buscar]);

  useEffect(() => {
    if (
      selectedCliente &&
      (modalAbierto === "ActualizarCliente" || modalAbierto === "AñadirCompra")
    ) {
      setNombre(selectedCliente.nombre);
      setTelefono(selectedCliente.telefono);
      setDeuda(String(selectedCliente.deuda));
      setCantEnvases(String(selectedCliente.cant_envases));
      setCantBidones(String(selectedCliente.cant_bidones));
    }
  }, [selectedCliente, modalAbierto]);

  const fetchCompras = async (id: number) => {
    try {
      const res = await axiosClient.get(
        `http://localhost:3000/app/clients/${id}/getpurchases`,
        { withCredentials: true },
      );
      setCompras(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Clientes</h1>
      <label>Buscar cliente</label>
      <input
        type="text"
        placeholder="Nombre"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />
      {!loading && !err && clients.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Deuda</th>
                <th>Cantidad de envases</th>
                <th>Cantidad de bidones</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.telefono}</td>
                  <td>{item.deuda}</td>
                  <td>{item.cant_envases}</td>
                  <td>{item.cant_bidones}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedClient(item);
                        setModalAbierto("ActualizarCliente");
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(item);
                        setModalAbierto("AñadirCompra");
                      }}
                    >
                      Añadir compra
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(item);
                        setModalAbierto("BorrarCliente");
                      }}
                    >
                      Borrar cliente
                    </button>
                    <button
                      onClick={async () => {
                        setSelectedClient(item);
                        setModalAbierto("ModificarCompra");
                        if (typeof item.id === "number") {
                          await fetchCompras(item.id);
                        }
                      }}
                    >
                      Ver compras
                    </button>
                  </td>
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
                  `http://localhost:3000/app/clients/${selectedCliente?.id}/modify`,
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
      {!loading && !err && modalAbierto === "AñadirCompra" && (
        <div>
          <h3>Añadir compra</h3>

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
                  `http://localhost:3000/app/clients/${selectedCliente?.id}/purchases`,
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
      {!loading &&
        !err &&
        modalAbierto === "ModificarCompra" &&
        compras.length > 0 && (
          <div>
            <h3>Compras</h3>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Sifones</th>
                  <th>Bidones 6l</th>
                  <th>Bidones 12l</th>
                  <th>Sifones que devuelve</th>
                  <th>Bidones que devuelve</th>
                  <th>Pago</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.cliente_id}</td>
                    <td>{item.sifones}</td>
                    <td>{item.bidones_6l}</td>
                    <td>{item.bidones_12l}</td>
                    <td>{item.devuelveSif}</td>
                    <td>{item.devuelveBid}</td>
                    <td>{item.pago}</td>
                    <td>{new Date(item.fecha).toLocaleDateString("es-UY")}</td>
                    <td>
                      <button
                        onClick={() => {
                          setCompraSeleccionada(item);
                          setSifones(String(item.sifones));
                          setBidones6l(String(item.bidones_6l));
                          setBidones12l(String(item.bidones_12l));
                          setDevuelveSif(String(item.devuelveSif));
                          setDevuelveBid(String(item.devuelveBid));
                          setPago(String(item.pago));
                          setModalAbierto("EditarCompra");
                        }}
                      >
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => {
                setModalAbierto(null);
              }}
            >
              Cerrar
            </button>
          </div>
        )}

      {!loading &&
        !err &&
        modalAbierto === "EditarCompra" &&
        compraSeleccionada && (
          <div>
            <h3>Modificando compra</h3>

            <p>Id: {compraSeleccionada.id}</p>
            <label>Sifones</label>
            <input
              type="number"
              placeholder="sifones"
              value={sifones}
              onChange={(e) => setSifones(e.target.value)}
            />
            <label>Bidones 6l</label>
            <input
              type="number"
              placeholder="bidones 6l"
              value={bidones_6l}
              onChange={(e) => setBidones6l(e.target.value)}
            />
            <label>Bidones 12l</label>
            <input
              type="number"
              placeholder="bidones 12l"
              value={bidones_12l}
              onChange={(e) => setBidones12l(e.target.value)}
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
            <label>Pago</label>
            <input
              type="number"
              placeholder="pago"
              value={pago}
              onChange={(e) => setPago(e.target.value)}
            />
            <button
              onClick={async () => {
                try {
                  await axiosClient.put(
                    `http://localhost:3000/app/clients/purchases/${compraSeleccionada.id}`,
                    {
                      sifones: Number(sifones),
                      bidones_6l: Number(bidones_6l),
                      bidones_12l: Number(bidones_12l),
                      devuelveBid: Number(devuelveBid),
                      devuelveSif: Number(devuelveSif),
                      pago: Number(pago),
                    },
                    { withCredentials: true },
                  );

                  setSifones("");
                  setBidones6l("");
                  setBidones12l("");
                  setDevuelveBid("");
                  setDevuelveSif("");
                  setPago("");

                  setCompraSeleccionada(null);
                  setModalAbierto("ModificarCompra");

                  setActualizar((prev) => prev + 1);
                  await fetchCompras(compraSeleccionada.cliente_id);
                } catch (error: any) {
                  setError(error.message);
                }
              }}
            >
              Aceptar
            </button>
            <button onClick={() => setModalAbierto("ModificarCompra")}>
              Cerrar
            </button>
          </div>
        )}

      {!loading && !err && modalAbierto === "BorrarCliente" && (
        <div>
          <h3>Borrar Cliente</h3>

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
                await axiosClient.delete(
                  `http://localhost:3000/app/clients/${selectedCliente?.id}/delete`,
                  {
                    withCredentials: true,
                    data: {
                      nombre: nombre,
                      telefono: telefono,
                    },
                  },
                );

                setNombre("");
                setTelefono("");
                setDeuda("");
                setCantEnvases("");
                setCantBidones("");

                setActualizar((prev) => prev + 1);
                setModalAbierto(null);
              } catch (error: any) {
                setError(error.message);
              }
            }}
          >
            Borrar
          </button>
          <button onClick={() => setModalAbierto(null)}>Cerrar</button>
        </div>
      )}
      {/* Modales Fin */}
      <button onClick={() => setModalAbierto("AñadirCliente")}>
        Añadir cliente
      </button>
    </>
  );
}

export default Clients;
