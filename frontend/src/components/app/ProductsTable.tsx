import React from "react";
import type { stockItem } from "../../types";

type ProductsTableProps = {
  data: stockItem[];
  handleEditing: (item?: stockItem | undefined) => void;
};

function ProductsTable({ data, handleEditing }: ProductsTableProps) {
  return (
    <div>
      <h1>Stock</h1>

      {data.map((item) => (
        <div key={item.id}>
          <h3>{item.nombre}</h3>
          <p>Precio: {item.precio}</p>
          <p>Cantidad: {item.cantidad}</p>
          <button onClick={() => handleEditing(item)}>Editar</button>
        </div>
      ))}
    </div>
  );
}

export default ProductsTable;
