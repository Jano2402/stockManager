import React from "react";
import type { stockItem } from "../../types";

type ProductsTableProps = {
  data: stockItem[];
  handleEditing: (item?: stockItem | undefined) => void;
};

function ProductsTable({ data, handleEditing }: ProductsTableProps) {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-semibold text-center mb-14">Stock</h1>

        <div className="grid grid-cols-3 gap-8">
          {data.map((item) => (
            <div
              key={item.id}
              className="
            bg-[#132238]/70
            border border-slate-700/40
            rounded-2xl
            p-6
            shadow-lg
            hover:border-sky-400/30
            hover:-translate-y-1
            transition-all duration-200
          "
            >
              <h3 className="text-2xl font-semibold text-slate-50">
                {item.nombre}
              </h3>

              <div className="mt-4 space-y-2">
                <p className="text-slate-300">
                  Precio:
                  <span className="text-slate-50 font-medium">
                    {" "}
                    ${item.precio}
                  </span>
                </p>

                <p
                  className={
                    item.cantidad === 0
                      ? "text-red-400"
                      : item.cantidad < 5
                        ? "text-yellow-400"
                        : "text-green-400"
                  }
                >
                  Cantidad: {item.cantidad}
                </p>
              </div>

              <button
                onClick={() => handleEditing(item)}
                className="
              w-full mt-6
              px-5 py-3
              rounded-xl
              bg-sky-400/10
              border border-sky-400/20
              text-sky-300
              font-medium
              hover:bg-sky-400/20
              hover:border-sky-400/40
              transition-all duration-200
            "
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;
