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
import { getErrorMessage } from "../../utils/app/errorHandler";
import toast from "react-hot-toast";

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
  // 🔥 Loadings separados
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingCompras, setLoadingCompras] = useState<boolean>(false);

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

  // 🔥 Compras
  const fetchCompras = async (id: number) => {
    setLoadingCompras(true);

    try {
      const data = await getCompras(id);

      setCompras(data);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingCompras(false);
    }
  };

  // 🔥 Añadir cliente
  const addClientPost = async (nombre: string, telefono: string) => {
    setLoadingSubmit(true);

    try {
      await postClient(nombre, telefono);

      resetCliente();

      setActualizar((prev) => prev + 1);

      setModalAbierto({ type: "NONE" });
      toast.success("Cliente añadido correctamente.");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 🔥 Actualizar cliente
  const updateClientPut = async () => {
    if (modalAbierto.type !== "ActualizarCliente") return;

    const data = buildUpdateClient(cliente);

    setLoadingSubmit(true);

    try {
      await putClient(modalAbierto.client.id, data);

      resetCliente();

      setModalAbierto({ type: "NONE" });

      setActualizar((prev) => prev + 1);
      toast.success("Cliente actualizado correctamente.");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 🔥 Añadir compra
  const addPurchasePost = async () => {
    if (modalAbierto.type !== "AñadirCompra") return;

    const data = buildCompraData(cliente);

    setLoadingSubmit(true);

    try {
      await postCompra(modalAbierto.client.id, data);

      resetCliente();

      setActualizar((prev) => prev + 1);

      setModalAbierto({ type: "NONE" });
      toast.success("Compra añadida correctamente.");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 🔥 Editar compra
  const updatePurchasePut = async () => {
    if (modalAbierto.type !== "EditarCompra") return;

    const data = buildCompraUpdate(cliente);

    setLoadingSubmit(true);

    try {
      await putCompra(modalAbierto.compra.id, data);

      resetCliente();

      setModalAbierto({
        type: "ModificarCompra",
        client: modalAbierto.client,
      });

      setActualizar((prev) => prev + 1);

      await fetchCompras(modalAbierto.compra.cliente_id);
      toast.success("Compra editada correctamente.");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 🔥 Borrar cliente
  const handleDelUser = async () => {
    if (modalAbierto.type !== "BorrarCliente") return;

    setLoadingSubmit(true);

    try {
      await delClient(modalAbierto.client.id, cliente.nombre, cliente.telefono);

      resetCliente();

      setActualizar((prev) => prev + 1);

      setModalAbierto({ type: "NONE" });
      toast.success("Cliente eliminado correctamente.");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingSubmit(false);
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

  // 🔥 Fetch clientes
  useEffect(() => {
    const controller = new AbortController();

    // Todos los clientes
    if (buscar === "") {
      setLoadingClients(true);

      axiosClient
        .get<client[]>("http://localhost:3000/app/clients/get")
        .then((res) => {
          setClients(res.data);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            toast.error(getErrorMessage(err));
          }
        })
        .finally(() => {
          setLoadingClients(false);
        });

      return () => controller.abort();
    }

    // Menos de 3 letras
    if (buscar.length < 3) {
      setLoadingClients(false);
      return;
    }

    setLoadingClients(true);

    const timeout = setTimeout(() => {
      axiosClient
        .get<client[]>(
          `http://localhost:3000/app/clients/search?nombre=${buscar}&limit=10`,
        )
        .then((res) => {
          setClients(res.data);
          if (res.data.length === 0) {
            toast("Cliente no encontrado.");
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            toast.error(getErrorMessage(err));
          }
        })
        .finally(() => {
          setLoadingClients(false);
        });
    }, 300);

    return () => {
      clearTimeout(timeout);

      controller.abort();
    };
  }, [actualizar, buscar]);

  // 🔥 Cargar datos cliente
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

  // 🔥 Fetch compras
  useEffect(() => {
    if (modalAbierto.type === "ModificarCompra") {
      fetchCompras(modalAbierto.client.id);
    }
  }, [modalAbierto]);

  return (
    <>
      {/* Header */}
      <div className="max-w-xl mx-auto mb-10">
        <h1 className="text-5xl font-semibold text-slate-50 mb-8">Clientes</h1>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Buscar cliente</label>

          <div className="flex items-center gap-6">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="
                w-full
                px-5 py-3
                rounded-2xl
                bg-[#132238]
                border border-slate-700/50
                text-slate-50
                placeholder:text-slate-500
                outline-none
                transition-all duration-200
                focus:border-sky-400
                focus:ring-4 focus:ring-sky-400/10
              "
            />

            <button
              onClick={() =>
                setModalAbierto({
                  type: "AñadirCliente",
                })
              }
              className="
                shrink-0
                h-[52px]
                px-5
                rounded-2xl
                bg-sky-400
                text-[#0B1220]
                font-semibold
                hover:bg-sky-300
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-200
                shadow-lg shadow-sky-500/20
              "
            >
              Añadir cliente
            </button>
          </div>

          {buscar.length > 0 && buscar.length < 3 && (
            <p className="text-sm text-slate-500">
              Escribí al menos 3 caracteres
            </p>
          )}
        </div>
      </div>

      {/* Loading clientes */}
      {loadingClients && (
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

          <p className="text-slate-400 text-md">Cargando clientes...</p>
        </div>
      )}

      {/* Tabla */}
      {!loadingClients && clients.length > 0 && (
        <ClientsTable clients={clients} setModalAbierto={setModalAbierto} />
      )}

      {!loadingClients && clients.length === 0 && (
        <p className="text-center text-slate-400">No hay clientes</p>
      )}

      {/* Compras loading */}
      {loadingCompras && (
        <div className="flex justify-center py-8">
          <div
            className="
              w-8 h-8
              rounded-full
              border-4 border-slate-700
              border-t-sky-400
              animate-spin
            "
          />
        </div>
      )}

      {/* Modales */}
      {modalAbierto.type === "AñadirCliente" && (
        <AddClientModal
          cliente={cliente}
          handleChange={handleChange}
          loading={loadingSubmit}
          onSubmit={() => addClientPost(cliente.nombre, cliente.telefono)}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}

      {modalAbierto.type === "ActualizarCliente" && (
        <UpdateClientModal
          cliente={cliente}
          handleChange={handleChange}
          loading={loadingSubmit}
          onSubmit={() => updateClientPut()}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}

      {modalAbierto.type === "AñadirCompra" && (
        <AnadirCompraModal
          cliente={cliente}
          handleChange={handleChange}
          loading={loadingSubmit}
          onSubmit={() => addPurchasePost()}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}

      {modalAbierto.type === "ModificarCompra" && compras.length > 0 && (
        <UpdatePurchaseTable
          compras={compras}
          handleEditPurchase={handleEditPurchase}
          setModalAbierto={setModalAbierto}
        />
      )}

      {modalAbierto.type === "EditarCompra" && (
        <EditarCompraModal
          compra={modalAbierto.compra}
          cliente={cliente}
          handleChange={handleChange}
          loading={loadingSubmit}
          onSubmit={() => updatePurchasePut()}
          onClose={() =>
            setModalAbierto({
              type: "ModificarCompra",
              client: modalAbierto.client,
            })
          }
        />
      )}

      {modalAbierto.type === "BorrarCliente" && (
        <DelClientModal
          cliente={cliente}
          handleChange={handleChange}
          loading={loadingSubmit}
          onSubmit={() => handleDelUser()}
          onClose={() => setModalAbierto({ type: "NONE" })}
        />
      )}
    </>
  );
}

export default Clients;
