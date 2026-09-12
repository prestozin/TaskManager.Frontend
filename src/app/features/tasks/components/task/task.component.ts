import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { TaskResponse } from '../../models/task.models';
import { normalizeClass } from '@shared/helpers/string.helper';

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

  readonly normalizeClass = normalizeClass;

  task = input.required<TaskResponse>();
  optionsClicked = output<HTMLElement>();
  taskClicked = output<string>();

  taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });

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
