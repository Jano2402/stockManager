import React from "react";
import Modal from "./Modal";
import type { Cliente } from "../../types";

type UpdateClientModalProps = {
  cliente: Cliente;
  handleChange: (field: keyof Cliente, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function UpdateClientModal({
  cliente,
  handleChange,
  onSubmit,
  onClose,
}: UpdateClientModalProps) {
  return (
    <Modal title={"Actualizar Cliente"} onClose={onClose}>
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

      <button onClick={onSubmit}>Aceptar</button>
    </Modal>
  );
}

export default UpdateClientModal;
