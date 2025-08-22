// import axios from "axios";
import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

interface stockItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const modificarProducto = async (
  idProducto: number,
  datosActualizados: stockItem,
) => {
  await axiosClient
    .put(
      `http://localhost:3000/app/stock/products/${idProducto}`,
      datosActualizados,
      {
        withCredentials: true,
      },
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      if (error.response?.status === 404) {
        console.error("Producto no encontrado");
      } else if (error.response?.status === 400) {
        console.error("Datos inválidos");
      } else {
        console.error("Error inesperado");
      }
    });
};

function Stock() {
  const [data, setData] = useState<stockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleEditing = (id?: number) => {
    if (id !== undefined) {
      setEditing(true);
      setEditingId(id);
    } else {
      setEditing(false);
      setEditingId(null);
    }
  };

  useEffect(() => {
    axiosClient
      .get<stockItem[]>("http://localhost:3000/app/stock/products")
      .then(function (response) {
        setData(response.data);
        setLoading(false);
        console.log(response);
      })
      .catch(function (error) {
        setError(error.message);
        setLoading(false);
        console.log(error);
      })
      .finally(function () {});
  }, []);

  // La función anda, falta implementarla
  // Siguiente paso hacer que al editar el producto se mande la request y actualizar
  // la página

  useEffect(() => {
    modificarProducto(1, {
      id: 1,
      nombre: "Sifones",
      precio: 30,
      cantidad: 0,
    });
  }, []);

  if (loading) return <div>Cargando ...</div>;
  if (error) return <div>Error: {error}</div>;

  const editingItem = data.find((item) => item.id === editingId);

  return editing && editingItem ? (
    <>
      <h1>Editando</h1>
      <div>
        <h3>{editingItem.nombre}</h3>
        <p>Precio actual: {editingItem.precio}</p>
        <div>
          <form onSubmit={() => {}}>
            <div>
              <label htmlFor="">Nuevo precio</label>
              <input type="number" onChange={() => {}} />
            </div>
          </form>
        </div>
        <p>Cantidad: {editingItem.cantidad}</p>
      </div>
      <button>Aceptar</button>
      <button onClick={() => handleEditing()}>Cancelar</button>
    </>
  ) : (
    <>
      <h1>Stock</h1>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <h3>{item.nombre}</h3>
            <p>Precio: {item.precio}</p>
            <p>Cantidad: {item.cantidad}</p>
            <button onClick={() => handleEditing(item.id)}>Editar</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Stock;
