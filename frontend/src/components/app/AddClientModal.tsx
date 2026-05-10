import React from "react";
import type { Cliente } from "../../types";
import Modal from "./Modal";

type AddClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function AddClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
}: AddClientModalProps) {
  return (
    <Modal title={"Añadir cliente"} onClose={onClose}>
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

      <button onClick={onSubmit}>Aceptar</button>
    </Modal>
  );
}

export default AddClientModal;
