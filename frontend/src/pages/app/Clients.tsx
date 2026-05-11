import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  postClient,
  putClient,
  postCompra,
  putCompra,
  delClient,
  getCompras,
} from "../../services/app/clientsService";
import type { client, compras, Cliente, ModalState } from "../../types";
import {
  buildCompraData,
  buildCompraUpdate,
  buildUpdateClient,
} from "../../utils/app/clientsUtils";
import UpdatePurchaseTable from "../../components/app/UpdatePurchaseTable";
import ClientsTable from "../../components/app/ClientsTable";
import AddClientModal from "../../components/app/AddClientModal";
import UpdateClientModal from "../../components/app/UpdateClientModal";
import AnadirCompraModal from "../../components/app/AnadirCompraModal";
import EditarCompraModal from "../../components/app/EditarCompraModal";
import DelClientModal from "../../components/app/DelClientModal";

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
  const [compras, setCompras] = useState<compras[]>([]);
  const [buscar, setBuscar] = useState<string>("");
  const [cliente, setCliente] = useState<Cliente>(clienteIncial);

  const [modalAbierto, setModalAbierto] = useState<ModalState>({
    type: "NONE",
  });

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
      const data = await getCompras(id);
      setCompras(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addClientPost = async (nombre: string, telefono: string) => {
    try {
      await postClient(nombre, telefono);

      resetCliente();

      setActualizar((prev) => prev + 1);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const updateClientPut = async () => {
    if (modalAbierto.type !== "ActualizarCliente") return;

    const data = buildUpdateClient(cliente);

    try {
      await putClient(modalAbierto.client.id, data);

      resetCliente();

      setModalAbierto({ type: "NONE" });
      setActualizar((prev) => prev + 1);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addPurchasePost = async () => {
    if (modalAbierto.type !== "AñadirCompra") return;

    const data = buildCompraData(cliente);

    try {
      await postCompra(modalAbierto.client.id, data);

      resetCliente();

      setActualizar((prev) => prev + 1);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const updatePurchasePut = async () => {
    if (modalAbierto.type !== "EditarCompra") return;

    const data = buildCompraUpdate(cliente);
    try {
      await putCompra(modalAbierto.compra.id, data);

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
  };

  const handleDelUser = async () => {
    if (modalAbierto.type !== "BorrarCliente") return;

    try {
      await delClient(modalAbierto.client.id, cliente.nombre, cliente.telefono);

      resetCliente();

      setActualizar((prev) => prev + 1);
      setModalAbierto({ type: "NONE" });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditPurchase = (item: compras) => {
    if (modalAbierto.type !== "ModificarCompra") return;

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

    if (buscar.length < 3) {
      setLoading(false);
      return;
    }

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
        <ClientsTable clients={clients} setModalAbierto={setModalAbierto} />
      )}
      {!loading && !err && clients.length === 0 && <p>No hay clientes</p>}
      {err && <p>{err}</p>}
      {loading && <p>Cargando...</p>}
      {/* Modales */}
      {!loading && !err && modalAbierto.type === "AñadirCliente" && (
        <AddClientModal
          cliente={cliente}
          handleChange={handleChange}
          onSubmit={() => addClientPost(cliente.nombre, cliente.telefono)}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}
      {!loading && !err && modalAbierto.type === "ActualizarCliente" && (
        <UpdateClientModal
          cliente={cliente}
          handleChange={handleChange}
          onSubmit={() => updateClientPut()}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}
      {!loading && !err && modalAbierto.type === "AñadirCompra" && (
        <AnadirCompraModal
          cliente={cliente}
          handleChange={handleChange}
          onSubmit={() => addPurchasePost()}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}
      {!loading &&
        !err &&
        modalAbierto.type === "ModificarCompra" &&
        compras.length > 0 && (
          <UpdatePurchaseTable
            compras={compras}
            handleEditPurchase={handleEditPurchase}
            setModalAbierto={setModalAbierto}
          />
        )}

      {!loading && !err && modalAbierto.type === "EditarCompra" && (
        <EditarCompraModal
          compra={modalAbierto.compra}
          cliente={cliente}
          handleChange={handleChange}
          onSubmit={() => updatePurchasePut()}
          onClose={() =>
            setModalAbierto({
              type: "ModificarCompra",
              client: modalAbierto.client,
            })
          }
        />
      )}

      {!loading && !err && modalAbierto.type === "BorrarCliente" && (
        <DelClientModal
          cliente={cliente}
          handleChange={handleChange}
          onSubmit={() => handleDelUser()}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}
      {/* Modales Fin */}
      <button onClick={() => setModalAbierto({ type: "AñadirCliente" })}>
        Añadir cliente
      </button>
    </>
  );
}

export default Clients;
