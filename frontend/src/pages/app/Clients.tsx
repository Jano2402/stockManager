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

type ModalState =
  | { type: "NONE" }
  | { type: "AñadirCliente" }
  | { type: "ActualizarCliente"; client: client }
  | { type: "AñadirCompra"; client: client }
  | { type: "ModificarCompra"; client: client }
  | { type: "EditarCompra"; compra: compras; client: client }
  | { type: "BorrarCliente"; client: client };

function Clients() {
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [clients, setClients] = useState<client[]>([]);
  const [actualizar, setActualizar] = useState<number>(0);
  const [compras, setCompras] = useState<compras[]>([]);

  const [buscar, setBuscar] = useState<string>("");

  const [modalAbierto, setModalAbierto] = useState<ModalState>({
    type: "NONE",
  });
  const [cliente, setCliente] = useState<Cliente>(clienteIncial);

  const resetCliente = () => {
    setCliente(clienteIncial);
  };

  const handleChange = (field: keyof Cliente, value: string) => {
    setCliente((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      modalAbierto.type === "ActualizarCliente" ||
      modalAbierto.type === "AñadirCompra"
    ) {
      setCliente({
        ...clienteIncial,
        nombre: modalAbierto.client.nombre,
        telefono: modalAbierto.client.telefono,
        deuda: String(modalAbierto.client.deuda),
        cant_envases: String(modalAbierto.client.cant_envases),
        cant_bidones: String(modalAbierto.client.cant_bidones),
      });
    }
  }, [modalAbierto]);

  useEffect(() => {
    if (modalAbierto.type === "ModificarCompra") {
      fetchCompras(modalAbierto.client.id);
    }
  }, [modalAbierto]);

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
                        setModalAbierto({
                          type: "ActualizarCliente",
                          client: item,
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setModalAbierto({ type: "AñadirCompra", client: item });
                      }}
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
      {!loading && !err && modalAbierto.type === "AñadirCliente" && (
        <div>
          <h3>Añadir cliente</h3>

          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={cliente.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={cliente.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
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
          <button onClick={() => setModalAbierto({ type: "NONE" })}>
            Cerrar
          </button>
        </div>
      )}
      {!loading && !err && modalAbierto.type === "ActualizarCliente" && (
        <div>
          <h3>Actualizar Cliente</h3>

          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={cliente.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={cliente.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
          />

          <label>Deuda</label>
          <input
            type="number"
            placeholder="Deuda"
            value={cliente.deuda}
            onChange={(e) => handleChange("deuda", e.target.value)}
          />

          <label>Cantidad de envases</label>
          <input
            type="number"
            placeholder="Cantidad de envases"
            value={cliente.cant_envases}
            onChange={(e) => handleChange("cant_envases", e.target.value)}
          />

          <label>Cantidad de bidones</label>
          <input
            type="number"
            placeholder="Cantidad de bidones"
            value={cliente.cant_bidones}
            onChange={(e) => handleChange("cant_bidones", e.target.value)}
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
                  `http://localhost:3000/app/clients/${modalAbierto.client.id}/modify`,
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
          <button onClick={() => setModalAbierto({ type: "NONE" })}>
            Cerrar
          </button>
        </div>
      )}
      {!loading && !err && modalAbierto.type === "AñadirCompra" && (
        <div>
          <h3>Añadir compra</h3>

          <label>Sifones</label>
          <input
            type="text"
            placeholder="sifones"
            value={cliente.sifones}
            onChange={(e) => handleChange("sifones", e.target.value)}
          />

          <label>Bidones 6l</label>
          <input
            type="text"
            placeholder="Bidones 6l"
            value={cliente.bidones_6l}
            onChange={(e) => handleChange("bidones_6l", e.target.value)}
          />

          <label>Bidones 12l</label>
          <input
            type="number"
            placeholder="Bidones 12l"
            value={cliente.bidones_12l}
            onChange={(e) => handleChange("bidones_12l", e.target.value)}
          />

          <label>Pago</label>
          <input
            type="number"
            placeholder="Pago"
            value={cliente.pago}
            onChange={(e) => handleChange("pago", e.target.value)}
          />

          <label>Sifones que devuelve</label>
          <input
            type="number"
            placeholder="Sifones que devuelve"
            value={cliente.devuelveSif}
            onChange={(e) => handleChange("devuelveSif", e.target.value)}
          />

          <label>Bidones que devuelve</label>
          <input
            type="number"
            placeholder="Bidones que devuelve"
            value={cliente.devuelveBid}
            onChange={(e) => handleChange("devuelveBid", e.target.value)}
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
                  `http://localhost:3000/app/clients/${modalAbierto.client.id}/purchases`,
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
          <button onClick={() => setModalAbierto({ type: "NONE" })}>
            Cerrar
          </button>
        </div>
      )}
      {!loading &&
        !err &&
        modalAbierto.type === "ModificarCompra" &&
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
                          setCliente({
                            ...clienteIncial,
                            sifones: String(item.sifones),
                            bidones_6l: String(item.bidones_6l),
                            bidones_12l: String(item.bidones_12l),
                            devuelveSif: String(item.devuelveSif),
                            devuelveBid: String(item.devuelveBid),
                            pago: String(item.pago),
                          });
                          setModalAbierto({
                            type: "EditarCompra",
                            compra: item,
                            client: modalAbierto.client,
                          });
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
                setModalAbierto({ type: "NONE" });
              }}
            >
              Cerrar
            </button>
          </div>
        )}

      {!loading && !err && modalAbierto.type === "EditarCompra" && (
        <div>
          <h3>Modificando compra</h3>

          <p>Id: {modalAbierto.compra.id}</p>
          <label>Sifones</label>
          <input
            type="number"
            placeholder="sifones"
            value={cliente.sifones}
            onChange={(e) => handleChange("sifones", e.target.value)}
          />
          <label>Bidones 6l</label>
          <input
            type="number"
            placeholder="bidones 6l"
            value={cliente.bidones_6l}
            onChange={(e) => handleChange("bidones_6l", e.target.value)}
          />
          <label>Bidones 12l</label>
          <input
            type="number"
            placeholder="bidones 12l"
            value={cliente.bidones_12l}
            onChange={(e) => handleChange("bidones_12l", e.target.value)}
          />
          <label>Sifones que devuelve</label>
          <input
            type="number"
            placeholder="Sifones que devuelve"
            value={cliente.devuelveSif}
            onChange={(e) => handleChange("devuelveSif", e.target.value)}
          />
          <label>Bidones que devuelve</label>
          <input
            type="number"
            placeholder="Bidones que devuelve"
            value={cliente.devuelveBid}
            onChange={(e) => handleChange("devuelveBid", e.target.value)}
          />
          <label>Pago</label>
          <input
            type="number"
            placeholder="pago"
            value={cliente.pago}
            onChange={(e) => handleChange("pago", e.target.value)}
          />
          <button
            onClick={async () => {
              try {
                await axiosClient.put(
                  `http://localhost:3000/app/clients/purchases/${modalAbierto.compra.id}`,
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

                setModalAbierto({
                  type: "ModificarCompra",
                  client: modalAbierto.client,
                });

                setActualizar((prev) => prev + 1);
                await fetchCompras(modalAbierto.compra.cliente_id);
              } catch (error: any) {
                setError(error.message);
              }
            }}
          >
            Aceptar
          </button>
          <button
            onClick={() =>
              setModalAbierto({
                type: "ModificarCompra",
                client: modalAbierto.client,
              })
            }
          >
            Cerrar
          </button>
        </div>
      )}

      {!loading && !err && modalAbierto.type === "BorrarCliente" && (
        <div>
          <h3>Borrar Cliente</h3>

          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={cliente.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />

          <label>Telefono</label>
          <input
            type="text"
            placeholder="Telefono"
            value={cliente.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
          />

          <button
            onClick={async () => {
              try {
                await axiosClient.delete(
                  `http://localhost:3000/app/clients/${modalAbierto.client.id}/delete`,
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
                setModalAbierto({ type: "NONE" });
              } catch (error: any) {
                setError(error.message);
              }
            }}
          >
            Borrar
          </button>
          <button onClick={() => setModalAbierto({ type: "NONE" })}>
            Cerrar
          </button>
        </div>
      )}
      {/* Modales Fin */}
      <button onClick={() => setModalAbierto({ type: "AñadirCliente" })}>
        Añadir cliente
      </button>
    </>
  );
}

export default Clients;
