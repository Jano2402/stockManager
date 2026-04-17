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
