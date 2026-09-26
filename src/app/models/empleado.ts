export interface Empleado {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}
