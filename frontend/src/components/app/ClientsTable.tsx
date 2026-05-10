import React from "react";
import type { client, ModalState } from "../../types";

type ClientsTableProps = {
  clients: client[];
  setModalAbierto: React.Dispatch<React.SetStateAction<ModalState>>;
};

function ClientsTable({ clients, setModalAbierto }: ClientsTableProps) {
  return (
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
  );
}

export default ClientsTable;
