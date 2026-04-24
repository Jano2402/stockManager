export interface client {
  id: number;
  nombre: string;
  telefono: string;
  deuda: number;
  cant_envases: number;
  cant_bidones: number;
}

export type UpdateClientData = {
  nombre?: string;
  telefono?: string;
  deuda?: number;
  cant_envases?: number;
  cant_bidones?: number;
};

export type Compra = {
  sifones?: number;
  bidones_6l?: number;
  bidones_12l?: number;
  pago?: number;
  devuelveSif?: number;
  devuelveBid?: number;
};

export interface compras {
  id: number;
  deuda: number;
  cliente_id: number;
  fecha: Date;
  sifones: number;
  bidones_12l: number;
  bidones_6l: number;
  devuelveSif: number;
  devuelveBid: number;
  totalCompra: number;
  pago: number;
}
