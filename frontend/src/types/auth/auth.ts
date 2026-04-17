export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
}

export interface ErrorResponse {
  message?: string;
  // Otras propiedades que pueda devolver la API en errores
}
