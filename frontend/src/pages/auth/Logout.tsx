import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import axiosClient from "../../api/axiosClient";

function Logout() {
  const [error, setError] = useState<string>("");

  const doLogout = async (): Promise<void> => {
    try {
      await axiosClient.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Error de Axios
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || "No estás logueado");
      } else if (err instanceof Error) {
        // Error genérico
        setError(err.message);
      } else {
        // Error desconocido
        setError("Ocurrió un error desconocido al cerrar sesión");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    doLogout();
  }, []);

  return <>{error && <p style={{ color: "red" }}>{error}</p>}</>;
}

export default Logout;
