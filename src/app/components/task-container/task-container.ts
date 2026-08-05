import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-container',
  imports: [
    ReactiveFormsModule

  ],
  templateUrl: './task-container.html',
  styleUrl: './task-container.scss',
})
export class TaskContainerComponent {

  taskForm = new FormGroup({
    title: new FormControl('',{ nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });
}
