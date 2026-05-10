import type { Compra, Cliente, UpdateClientData } from "../../types";

export const buildCompraData = (cliente: Cliente): Compra => ({
  ...(cliente.sifones !== "" && {
    sifones: Number(cliente.sifones),
  }),

  ...(cliente.bidones_6l !== "" && {
    bidones_6l: Number(cliente.bidones_6l),
  }),

  ...(cliente.bidones_12l !== "" && {
    bidones_12l: Number(cliente.bidones_12l),
  }),

  ...(cliente.pago !== "" && {
    pago: Number(cliente.pago),
  }),

  ...(cliente.devuelveSif !== "" && {
    devuelveSif: Number(cliente.devuelveSif),
  }),

  ...(cliente.devuelveBid !== "" && {
    devuelveBid: Number(cliente.devuelveBid),
  }),
});

export const buildUpdateClient = (cliente: Cliente): UpdateClientData => ({
  ...(cliente.nombre !== "" && { nombre: cliente.nombre }),
  ...(cliente.telefono !== "" && { telefono: cliente.telefono }),
  ...(cliente.deuda !== "" && { deuda: Number(cliente.deuda) }),
  ...(cliente.cant_envases !== "" && {
    cant_envases: Number(cliente.cant_envases),
  }),
  ...(cliente.cant_bidones !== "" && {
    cant_bidones: Number(cliente.cant_bidones),
  }),
});

export const buildCompraUpdate = (cliente: Cliente): Compra => ({
  sifones: Number(cliente.sifones),
  bidones_6l: Number(cliente.bidones_6l),
  bidones_12l: Number(cliente.bidones_12l),
  devuelveBid: Number(cliente.devuelveBid),
  devuelveSif: Number(cliente.devuelveSif),
  pago: Number(cliente.pago),
});
