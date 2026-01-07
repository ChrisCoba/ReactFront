// User type definitions based on the API structure
export interface User {
  Id?: number;
  Email: string;
  Nombre: string;
  Apellido: string;
  EsAdmin: boolean;
  Telefono?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  cedula?: string;
}
