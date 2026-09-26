import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit { 
  error = '';
  success = '';
  fieldErrors: Record<string, string> = {};
  loading = false;
  saving = false;
  deletingId: string | null = null;
  editingId: string | null = null;

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

  saveEmpleado(form: NgForm): void {
    if (form.invalid) return;
    this.error = '';
    this.success = '';
    this.fieldErrors = {};
    this.saving = true;
    const isEditing = this.editingId !== null;
    const request = isEditing
      ? this.empleadoService.updateEmpleado(this.editingId!, this.empleadoService.selectedEmpleado)
      : this.empleadoService.createEmpleado(this.empleadoService.selectedEmpleado);

    request.subscribe({
      next: () => {
        this.success = isEditing ? 'Empleado actualizado correctamente.' : 'Empleado creado correctamente.';
        this.cancelEdit(form);
        this.getEmpleados();
        this.saving = false;
      },
      error: (error) => {
        this.showApiErrors(error, isEditing ? 'actualizar' : 'crear');
        this.saving = false;
      },
    });
  }

  editEmpleado(empleado: Empleado, form: NgForm): void {
    if (!empleado.id) return;
    this.error = '';
    this.success = '';
    this.fieldErrors = {};
    this.editingId = empleado.id;
    this.empleadoService.selectedEmpleado = {
      ...empleado,
      hireDate: empleado.hireDate ? empleado.hireDate.slice(0, 10) : this.empleadoService.emptyEmployee().hireDate,
    };
    form.resetForm(this.empleadoService.selectedEmpleado);
  }

  cancelEdit(form: NgForm): void {
    this.editingId = null;
    this.empleadoService.selectedEmpleado = this.empleadoService.emptyEmployee();
    form.resetForm(this.empleadoService.selectedEmpleado);
  }

  removeEmpleado(empleado: Empleado): void {
    if (!empleado.id || !window.confirm(`¿Eliminar a ${empleado.firstName} ${empleado.lastName}?`)) return;
    this.error = '';
    this.success = '';
    this.fieldErrors = {};
    this.deletingId = empleado.id;
    this.empleadoService.deleteEmpleado(empleado.id).subscribe({
      next: () => {
        this.success = 'Empleado eliminado correctamente.';
        this.deletingId = null;
        this.getEmpleados();
      },
      error: (error) => {
        this.error = error?.error?.message ?? 'No fue posible eliminar el empleado.';
        this.deletingId = null;
      },
    });
  }

  private showApiErrors(error: any, action: string): void {
    const response = error?.error;
    this.error = response?.message ?? `No fue posible ${action} el empleado.`;
    this.fieldErrors = {};

    const details = response?.error?.details;
    if (!Array.isArray(details)) return;

    details.forEach((detail: unknown) => {
      if (!detail || typeof detail !== 'object') return;
      const validationError = detail as { field?: unknown; message?: unknown };
      if (typeof validationError.field === 'string' && typeof validationError.message === 'string') {
        this.fieldErrors[validationError.field] = validationError.message;
      }
    });
  }
}

