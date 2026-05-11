import React from "react";
import type { Cliente } from "../../types";
import Modal from "./Modal";

type AnadirCompraModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function AnadirCompraModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
}: AnadirCompraModalProps) {
  return (
    <Modal title={"Añadir Compra"} onClose={onClose}>
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

        <button onClick={onSubmit}>Aceptar</button>
      </div>
    </Modal>
  );
}

export default AnadirCompraModal;
