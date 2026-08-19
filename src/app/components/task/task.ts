import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskResponse } from '../../types/task/task-response';

@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './task.html',
  styleUrl: './task.scss',
})
export class TaskComponent {

  task = input.required<TaskResponse>();

  taskForm = new FormGroup({
    title: new FormControl('',{ nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });
}
