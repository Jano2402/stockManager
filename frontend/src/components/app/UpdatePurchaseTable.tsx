import React from "react";
import type { compras, ModalState } from "../../types";

type UpdatePurchaseTableProps = {
  compras: compras[];
  handleEditPurchase: (item: compras) => void;
  setModalAbierto: React.Dispatch<React.SetStateAction<ModalState>>;
};

function UpdatePurchaseTable({
  compras,
  handleEditPurchase,
  setModalAbierto,
}: UpdatePurchaseTableProps) {
  return (
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
                <button onClick={() => handleEditPurchase(item)}>
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
  );
}

export default UpdatePurchaseTable;
