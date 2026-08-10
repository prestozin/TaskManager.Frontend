import { Component } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-container',
  imports: [
    TaskComponent,
    ReactiveFormsModule
  ],
  templateUrl: './task-container.html',
  styleUrl: './task-container.scss',
})
export class TaskContainerComponent {
  
  allTasksForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  }); 

  searchControl = new FormControl('', {nonNullable: true});

}
