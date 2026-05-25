import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { postLogout } from "../../services/app/authService";
import { getErrorMessage } from "../../utils/app/errorHandler";
import toast from "react-hot-toast";

function Logout() {
  const doLogout = async (): Promise<void> => {
    try {
      await postLogout();
      toast.success("Sesión cerrada correctamente.");
      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Error de Axios
        const axiosError = err as AxiosError<{ message?: string }>;
        toast.error(axiosError.response?.data?.message || "No estás logueado");
      } else if (err instanceof Error) {
        // Error genérico
        toast.error(getErrorMessage(err));
      } else {
        // Error desconocido
        toast.error("Ocurrió un error desconocido al cerrar sesión");
      }
    }
  };

  useEffect(() => {
    doLogout();
  }, []);

  return <></>;
}

export default Logout;
