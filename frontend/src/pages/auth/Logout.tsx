import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { postLogout } from "../../services/app/authService";
import { getErrorMessage } from "../../utils/app/errorHandler";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function Logout() {
  const navigate = useNavigate();
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
        toast.error("Ocurrió un error desconocido al cerrar sesión");
      }
    }
  };

  useEffect(() => {
    doLogout();
    navigate("/auth/login");
  }, []);

  return <></>;
}

export default Logout;
