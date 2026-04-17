export interface compraAgrupada {
  nombre: string;
  sifones: number;
  bidon6L: number;
  bidon12L: number;
  totalPagado: number;
  totalCompra: number;
  totalDebiendo: number;
}

export interface ApiResponse {
  data: compraAgrupada[];
  message: string;
}
