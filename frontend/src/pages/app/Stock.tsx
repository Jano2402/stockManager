// import axios from "axios";
import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

interface stockItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

function Stock() {
  const [data, setData] = useState<stockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Cargando ...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Stock</h1>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <h3>{item.nombre}</h3>
            <p>Precio: {item.precio}</p>
            <p>Cantidad: {item.cantidad}</p>
            <button>Editar</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Stock;
