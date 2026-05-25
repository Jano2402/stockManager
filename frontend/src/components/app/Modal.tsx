import React from "react";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      className="
        fixed inset-0
        z-50

        flex items-center justify-center

        bg-black/70

        px-4
      "
    >
      <div
        className="
          w-full max-w-6xl
          max-h-[90vh]

          rounded-3xl
          border border-slate-700/40

          bg-[#132238]
          shadow-2xl

          flex flex-col

          overflow-hidden

          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        <div
          className="
            flex items-center justify-between

            px-8 py-6

            border-b border-slate-700/30
          "
        >
          <h2 className="text-2xl font-semibold text-slate-50">{title}</h2>

          <button
            onClick={onClose}
            className="
              px-4 py-2

              rounded-xl

              bg-red-500/10
              border border-red-500/20

              text-red-300
              font-medium

              hover:bg-red-500/20
              hover:border-red-500/40

              transition-all duration-200
            "
          >
            Cerrar
          </button>
        </div>

        <div className="overflow-y-auto p-8 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
