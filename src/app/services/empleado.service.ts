import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Empleado } from '../models/empleado';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  readonly apiUrl = environment.apiUrl;
  empleados: Empleado[] = [];
  selectedEmpleado: Empleado = this.emptyEmployee();

  constructor(private readonly http: HttpClient) {}

  getEmpleados() {
    return this.http.get<ApiResponse<Empleado[]>>(`${this.apiUrl}?page=1&limit=100`);
  }

  createEmpleado(empleado: Empleado) {
    return this.http.post<ApiResponse<Empleado>>(this.apiUrl, empleado);
  }

  updateEmpleado(id: string, empleado: Empleado) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = empleado;
    return this.http.put<ApiResponse<Empleado>>(`${this.apiUrl}/${id}`, data);
  }

  deleteEmpleado(id: string) {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  emptyEmployee(): Empleado {
    return {
      firstName: '', lastName: '', email: '', documentId: '', position: '',
      department: '', salary: 0, hireDate: new Date().toISOString().slice(0, 10),
    };
  }
}
