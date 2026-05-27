import axiosClient from "../../api/axiosClient";
import type { UpdateClientData, Compra } from "../../types";

export const postClient = async (nombre: string, telefono: string) => {
  await axiosClient.post(
    "/app/clients/init",
    { nombre, telefono },
    { withCredentials: true },
  );
};

export const putClient = async (id: number, data: UpdateClientData) => {
  await axiosClient.put(`/app/clients/${id}/modify`, data, {
    withCredentials: true,
  });
};

export const postCompra = async (id: number, data: Compra) => {
  await axiosClient.post(`/app/clients/${id}/purchases`, data, {
    withCredentials: true,
  });
};

export const putCompra = async (id: number, data: Compra) => {
  await axiosClient.put(`/app/clients/purchases/${id}`, data, {
    withCredentials: true,
  });
};

export const delClient = async (
  id: number,
  nombre: string,
  telefono: string,
) => {
  await axiosClient.delete(`/app/clients/${id}/delete`, {
    withCredentials: true,
    data: {
      nombre,
      telefono,
    },
  });
};

export const getCompras = async (id: number) => {
  const res = await axiosClient.get(`/app/clients/${id}/getpurchases`, {
    withCredentials: true,
  });

  return res.data;
};
