import React from "react";
import axiosClient from "../../api/axiosClient";
import type { stockItem } from "../../types";

export const modificarProducto = async (
  idProducto: number,
  datosActualizados: stockItem,
) => {
  const response = await axiosClient.put(
    `/app/stock/products/${idProducto}`,
    datosActualizados,
    { withCredentials: true },
  );
  return response.data;
};

export const getProductos = async () => {
  const res = await axiosClient.get<stockItem[]>("/app/stock/products", {
    withCredentials: true,
  });

  return res.data;
};
