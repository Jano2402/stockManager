export function getErrorMessage(error: any): string {
  const status = error?.response?.status;

  switch (status) {
    case 400:
      return "Datos inválidos.";

    case 401:
      return "No autorizado.";

    case 403:
      return "No tenés permisos para hacer esto.";

    case 404:
      return "Recurso no encontrado.";

    case 409:
      return "Ese elemento ya existe.";

    case 429:
      return "Alcanzaste el límite de peticiones.";

    case 500:
      return "Error interno del servidor.";

    default:
      return "Ocurrió un error inesperado.";
  }
}
