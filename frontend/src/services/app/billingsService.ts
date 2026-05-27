import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../../types";

export const getComprasAgrupadas = async (
  fechaInicio: string,
  fechaFin: string,
) =>
  await axiosClient.get<ApiResponse>("/app/billings/purchases", {
    params: { fechaInicio, fechaFin },
    withCredentials: true,
  });
