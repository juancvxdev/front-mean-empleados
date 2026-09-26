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

  emptyEmployee(): Empleado {
    return {
      firstName: '', lastName: '', email: '', documentId: '', position: '',
      department: '', salary: 0, hireDate: new Date().toISOString().slice(0, 10),
    };
  }
}
