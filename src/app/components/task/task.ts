import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './task.html',
  styleUrl: './task.scss',
})
export class TaskComponent {

  taskForm = new FormGroup({
    title: new FormControl('',{ nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });
}
