import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import type { stockItem } from "../../types";

const modificarProducto = async (
  idProducto: number,
  datosActualizados: stockItem,
) => {
  const response = await axiosClient.put(
    `http://localhost:3000/app/stock/products/${idProducto}`,
    datosActualizados,
    { withCredentials: true },
  );
  return response.data;
};

function Stock() {
  const [data, setData] = useState<stockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<stockItem | null>(null);

  useEffect(() => {
    axiosClient
      .get<stockItem[]>("http://localhost:3000/app/stock/products")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEditing = (item?: stockItem) => {
    if (item) {
      setEditing(true);
      setFormData({ ...item });
    } else {
      setEditing(false);
      setFormData(null);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      await modificarProducto(formData.id, formData);

      setData((prev) =>
        prev.map((item) => (item.id === formData.id ? formData : item)),
      );

      handleEditing();
    } catch (err) {
      console.error(err);
      alert("Error al modificar producto");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return editing && formData ? (
    <>
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
    </>
  ) : (
    <>
      <h1>Stock</h1>

      {data.map((item) => (
        <div key={item.id}>
          <h3>{item.nombre}</h3>
          <p>Precio: {item.precio}</p>
          <p>Cantidad: {item.cantidad}</p>
          <button onClick={() => handleEditing(item)}>Editar</button>
        </div>
      ))}
    </>
  );
}

export default Stock;
