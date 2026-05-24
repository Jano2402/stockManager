import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { postLogout } from "../../services/app/authService";
import { getErrorMessage } from "../../utils/app/errorHandler";

function Logout() {
  const [error, setError] = useState<string>("");

  const doLogout = async (): Promise<void> => {
    try {
      await postLogout();

      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Error de Axios
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || "No estás logueado");
      } else if (err instanceof Error) {
        // Error genérico
        setError(getErrorMessage(err));
      } else {
        // Error desconocido
        setError("Ocurrió un error desconocido al cerrar sesión");
      }
    }
  };

  useEffect(() => {
    doLogout();
  }, []);

  return <>{error && <p>{error}</p>}</>;
}

export default Logout;
