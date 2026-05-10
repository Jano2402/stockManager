import axiosClient from "../../api/axiosClient";
import type { UpdateClientData, Compra } from "../../types";

export const postClient = async (nombre: string, telefono: string) => {
  await axiosClient.post(
    "http://localhost:3000/app/clients/init",
    { nombre, telefono },
    { withCredentials: true },
  );
};

export const putClient = async (id: number, data: UpdateClientData) => {
  await axiosClient.put(
    `http://localhost:3000/app/clients/${id}/modify`,
    data,
    { withCredentials: true },
  );
};

export const postCompra = async (id: number, data: Compra) => {
  await axiosClient.post(
    `http://localhost:3000/app/clients/${id}/purchases`,
    data,
    { withCredentials: true },
  );
};

export const putCompra = async (id: number, data: Compra) => {
  await axiosClient.put(
    `http://localhost:3000/app/clients/purchases/${id}`,
    data,
    { withCredentials: true },
  );
};

export const delClient = async (
  id: number,
  nombre: string,
  telefono: string,
) => {
  await axiosClient.delete(`http://localhost:3000/app/clients/${id}/delete`, {
    withCredentials: true,
    data: {
      nombre,
      telefono,
    },
  });
};

export const getCompras = async (id: number) => {
  const res = await axiosClient.get(
    `http://localhost:3000/app/clients/${id}/getpurchases`,
    { withCredentials: true },
  );

  return res.data;
};
