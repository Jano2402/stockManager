import React from "react";
import type { stockItem } from "../../types";

type ProductsListingProps = {
  formData: stockItem;
  setFormData: React.Dispatch<React.SetStateAction<stockItem | null>>;
  handleSave: () => Promise<void>;
  handleEditing: (item?: stockItem | undefined) => void;
};

function ProductsListing({
  formData,
  setFormData,
  handleSave,
  handleEditing,
}: ProductsListingProps) {
  return (
    <div
      className="
        fixed inset-0
        bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        z-50
        px-4
      "
    >
      <div
        className="
          w-full max-w-md
          bg-[#132238]
          border border-slate-700/40
          rounded-3xl
          p-8
          shadow-2xl

          overflow-hidden

          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-50">
            Editar producto
          </h1>

          <p className="text-slate-400 mt-2">
            Modificando:
            <span className="text-slate-200 font-medium">
              {" "}
              {formData.nombre}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Precio</label>

            <input
              type="number"
              value={formData.precio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precio: Number(e.target.value),
                })
              }
              className="
                w-full
                px-4 py-3
                rounded-xl
                bg-[#0B1220]
                border border-slate-700
                text-slate-50
                outline-none
                focus:border-sky-400
                focus:ring-2 focus:ring-sky-400/20
                transition-all
              "
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Cantidad
            </label>

            <input
              type="number"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidad: Number(e.target.value),
                })
              }
              className="
                w-full
                px-4 py-3
                rounded-xl
                bg-[#0B1220]
                border border-slate-700
                text-slate-50
                outline-none
                focus:border-sky-400
                focus:ring-2 focus:ring-sky-400/20
                transition-all
              "
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            className="
              flex-1
              px-5 py-3
              rounded-xl
              bg-sky-400/10
              border border-sky-400/20
              text-sky-300
              font-medium
              hover:bg-sky-400/20
              hover:border-sky-400/40
              transition-all
            "
          >
            Guardar
          </button>

          <button
            onClick={() => handleEditing()}
            className="
              flex-1
              px-5 py-3
              rounded-xl
              bg-red-500/10
              border border-red-500/20
              text-red-300
              font-medium
              hover:bg-red-500/20
              hover:border-red-500/40
              transition-all
            "
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsListing;
