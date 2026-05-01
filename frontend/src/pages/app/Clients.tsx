import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { client, UpdateClientData, Compra, compras } from "../../types";

interface Cliente {
  nombre: string;
  telefono: string;
  deuda: string;
  cant_envases: string;
  cant_bidones: string;
  sifones: string;
  bidones_6l: string;
  bidones_12l: string;
  pago: string;
  devuelveBid: string;
  devuelveSif: string;
}

const clienteIncial: Cliente = {
  nombre: "",
  telefono: "",
  deuda: "",
  cant_envases: "",
  cant_bidones: "",
  sifones: "",
  bidones_6l: "",
  bidones_12l: "",
  pago: "",
  devuelveBid: "",
  devuelveSif: "",
};

function Clients() {
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [clients, setClients] = useState<client[]>([]);
  const [actualizar, setActualizar] = useState<number>(0);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [compras, setCompras] = useState<compras[]>([]);

  // const [actualizarCompra, setActualizarCompra] = useState<number>(0);
  // const [id, setId] = useState<number | undefined>(-1);

  const [buscar, setBuscar] = useState<string>("");
  const [selectedCliente, setSelectedClient] = useState<client | null>(null);
  const [compraSeleccionada, setCompraSeleccionada] = useState<compras | null>(
    null,
  );

  const [cliente, setCliente] = useState<Cliente>(clienteIncial);

  const resetCliente = () => {
    setCliente(clienteIncial);
  };

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
      setCliente((prev) => ({
        ...prev,
        nombre: selectedCliente.nombre,
      }));
      setCliente((prev) => ({
        ...prev,
        telefono: selectedCliente.telefono,
      }));
      setCliente((prev) => ({
        ...prev,
        deuda: String(selectedCliente.deuda),
      }));
      setCliente((prev) => ({
        ...prev,
        cant_envases: String(selectedCliente.cant_envases),
      }));
      setCliente((prev) => ({
        ...prev,
        cant_bidones: String(selectedCliente.cant_bidones),
      }));
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
              {clients.map((item) => (
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
            value={cliente.nombre}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={cliente.telefono}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                telefono: e.target.value,
              }))
            }
          />

          <button
            onClick={async () => {
              try {
                await axiosClient.post(
                  "http://localhost:3000/app/clients/init",
                  { nombre: cliente.nombre, telefono: cliente.telefono },
                  { withCredentials: true },
                );

                resetCliente();

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
            value={cliente.nombre}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={cliente.telefono}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                telefono: e.target.value,
              }))
            }
          />

          <label>Deuda</label>
          <input
            type="number"
            placeholder="Deuda"
            value={cliente.deuda}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                deuda: e.target.value,
              }))
            }
          />

          <label>Cantidad de envases</label>
          <input
            type="number"
            placeholder="Cantidad de envases"
            value={cliente.cant_envases}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                cant_envases: e.target.value,
              }))
            }
          />

          <label>Cantidad de bidones</label>
          <input
            type="number"
            placeholder="Cantidad de bidones"
            value={cliente.cant_bidones}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                cant_bidones: e.target.value,
              }))
            }
          />

          <button
            onClick={async () => {
              const data: UpdateClientData = {
                ...(cliente.nombre !== "" && { nombre: cliente.nombre }),
                ...(cliente.telefono !== "" && { telefono: cliente.telefono }),
                ...(cliente.deuda !== "" && { deuda: Number(cliente.deuda) }),
                ...(cliente.cant_envases !== "" && {
                  cant_envases: Number(cliente.cant_envases),
                }),
                ...(cliente.cant_bidones !== "" && {
                  cant_bidones: Number(cliente.cant_bidones),
                }),
              };

              try {
                await axiosClient.put(
                  `http://localhost:3000/app/clients/${selectedCliente?.id}/modify`,
                  data,
                  { withCredentials: true },
                );

                resetCliente();

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
            value={cliente.sifones}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                sifones: e.target.value,
              }))
            }
          />

          <label>Bidones 6l</label>
          <input
            type="text"
            placeholder="Bidones 6l"
            value={cliente.bidones_6l}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                bidones_6l: e.target.value,
              }))
            }
          />

          <label>Bidones 12l</label>
          <input
            type="number"
            placeholder="Bidones 12l"
            value={cliente.bidones_12l}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                bidones_12l: e.target.value,
              }))
            }
          />

          <label>Pago</label>
          <input
            type="number"
            placeholder="Pago"
            value={cliente.pago}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                pago: e.target.value,
              }))
            }
          />

          <label>Sifones que devuelve</label>
          <input
            type="number"
            placeholder="Sifones que devuelve"
            value={cliente.devuelveSif}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                devuelveSif: e.target.value,
              }))
            }
          />

          <label>Bidones que devuelve</label>
          <input
            type="number"
            placeholder="Bidones que devuelve"
            value={cliente.devuelveBid}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                devuelveBid: e.target.value,
              }))
            }
          />

          <button
            onClick={async () => {
              const data: Compra = {
                ...(cliente.sifones !== "" && {
                  sifones: Number(cliente.sifones),
                }),
                ...(cliente.bidones_6l !== "" && {
                  bidones_6l: Number(cliente.bidones_6l),
                }),
                ...(cliente.bidones_12l !== "" && {
                  bidones_12l: Number(cliente.bidones_12l),
                }),
                ...(cliente.pago !== "" && { pago: Number(cliente.pago) }),
                ...(cliente.devuelveSif !== "" && {
                  devuelveSif: Number(cliente.devuelveSif),
                }),
                ...(cliente.devuelveBid !== "" && {
                  devuelveBid: Number(cliente.devuelveBid),
                }),
              };

              try {
                await axiosClient.post(
                  `http://localhost:3000/app/clients/${selectedCliente?.id}/purchases`,
                  data,
                  { withCredentials: true },
                );

                resetCliente();

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
                {compras.map((item) => (
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
                          setCliente((prev) => ({
                            ...prev,
                            sifones: String(item.sifones),
                          }));
                          setCliente((prev) => ({
                            ...prev,
                            bidones_6l: String(item.bidones_6l),
                          }));
                          setCliente((prev) => ({
                            ...prev,
                            bidones_12l: String(item.bidones_12l),
                          }));
                          setCliente((prev) => ({
                            ...prev,
                            devuelveSif: String(item.devuelveSif),
                          }));
                          setCliente((prev) => ({
                            ...prev,
                            devuelveBid: String(item.devuelveBid),
                          }));
                          setCliente((prev) => ({
                            ...prev,
                            pago: String(item.pago),
                          }));
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
              value={cliente.sifones}
              onChange={(e) =>
                setCliente((prev) => ({
                  ...prev,
                  sifones: e.target.value,
                }))
              }
            />
            <label>Bidones 6l</label>
            <input
              type="number"
              placeholder="bidones 6l"
              value={cliente.bidones_6l}
              onChange={(e) =>
                setCliente((prev) => ({
                  ...prev,
                  bidones_6l: e.target.value,
                }))
              }
            />
            <label>Bidones 12l</label>
            <input
              type="number"
              placeholder="bidones 12l"
              value={cliente.bidones_12l}
              onChange={(e) =>
                setCliente((prev) => ({
                  ...prev,
                  bidones_12l: e.target.value,
                }))
              }
            />
            <label>Sifones que devuelve</label>
            <input
              type="number"
              placeholder="Sifones que devuelve"
              value={cliente.devuelveSif}
              onChange={(e) =>
                setCliente((prev) => ({
                  ...prev,
                  devuelveSif: e.target.value,
                }))
              }
            />
            <label>Bidones que devuelve</label>
            <input
              type="number"
              placeholder="Bidones que devuelve"
              value={cliente.devuelveBid}
              onChange={(e) =>
                setCliente((prev) => ({
                  ...prev,
                  devuelveBid: e.target.value,
                }))
              }
            />
            <label>Pago</label>
            <input
              type="number"
              placeholder="pago"
              value={cliente.pago}
              onChange={(e) =>
                setCliente((prev) => ({
                  ...prev,
                  pago: e.target.value,
                }))
              }
            />
            <button
              onClick={async () => {
                try {
                  await axiosClient.put(
                    `http://localhost:3000/app/clients/purchases/${compraSeleccionada.id}`,
                    {
                      sifones: Number(cliente.sifones),
                      bidones_6l: Number(cliente.bidones_6l),
                      bidones_12l: Number(cliente.bidones_12l),
                      devuelveBid: Number(cliente.devuelveBid),
                      devuelveSif: Number(cliente.devuelveSif),
                      pago: Number(cliente.pago),
                    },
                    { withCredentials: true },
                  );

                  resetCliente();

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
            value={cliente.nombre}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={cliente.telefono}
            onChange={(e) =>
              setCliente((prev) => ({
                ...prev,
                telefono: e.target.value,
              }))
            }
          />

          <button
            onClick={async () => {
              try {
                await axiosClient.delete(
                  `http://localhost:3000/app/clients/${selectedCliente?.id}/delete`,
                  {
                    withCredentials: true,
                    data: {
                      nombre: cliente.nombre,
                      telefono: cliente.telefono,
                    },
                  },
                );

                resetCliente();

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
