import React from "react";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div>
      <div>
        <div>
          <h2>{title}</h2>

          <button onClick={onClose}>Cerrar</button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
