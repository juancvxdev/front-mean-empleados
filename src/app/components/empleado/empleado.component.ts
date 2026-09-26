import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit { 
  error = '';
  loading = false;

  constructor(public empleadoService: EmpleadoService) {}

  ngOnInit(): void { this.getEmpleados(); }

  getEmpleados(): void {
    this.loading = true;
    this.error = '';
    this.empleadoService.getEmpleados().subscribe({
      next: (response) => {
        this.empleadoService.empleados = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No fue posible obtener los empleados desde la API.';
        this.loading = false;
      },
    });
  }

  addEmpleado(form: NgForm): void {
    if (form.invalid) return;
    this.error = '';
    this.empleadoService.createEmpleado(this.empleadoService.selectedEmpleado).subscribe({
      next: () => {
        form.resetForm();
        this.empleadoService.selectedEmpleado = this.empleadoService.emptyEmployee();
        this.getEmpleados();
      },
      error: (error) => this.error = error?.error?.message ?? 'No fue posible crear el empleado.',
    });
  }
}

