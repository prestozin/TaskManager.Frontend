import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { TaskResponse } from '../../models/task.models';

@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {

  task = input.required<TaskResponse>();

  taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });

  normalizeClass(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD') //separa os acentos
      .replace(/[\u0300-\u036f]/g, '') //remove os acentos
      .replace(/\s+/g, '-'); //transforma espaços em -
  }

  capitalizeFirst(value: string): string {
    if (!value) return '';

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  truncateText(value: string, maxLength: number = 80): string {
    if (!value) return '';

    if (value.length <= maxLength) {
      return value;
    }

    return value.substring(0, maxLength) + '...';
  }
}
