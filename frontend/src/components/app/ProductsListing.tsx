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
    <div>
      <h1>Editando producto</h1>

      <h3>{formData.nombre}</h3>

      <div>
        <label>Precio</label>
        <input
          type="number"
          value={formData.precio}
          onChange={(e) =>
            setFormData({
              ...formData,
              precio: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label>Cantidad</label>
        <input
          type="number"
          value={formData.cantidad}
          onChange={(e) =>
            setFormData({
              ...formData,
              cantidad: Number(e.target.value),
            })
          }
        />
      </div>

      <button onClick={handleSave}>Aceptar</button>
      <button onClick={() => handleEditing()}>Cancelar</button>
    </div>
  );
}

export default ProductsListing;
