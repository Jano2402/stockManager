import React from "react";
import Modal from "./Modal";
import type { Cliente } from "../../types";

type DelClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function DelClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
}: DelClientModalProps) {
  return (
    <Modal title={"Borrar Cliente"} onClose={onClose}>
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

        <button onClick={onSubmit}>Borrar</button>
      </div>
    </Modal>
  );
}

export default DelClientModal;
