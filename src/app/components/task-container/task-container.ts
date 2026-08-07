import { Component } from '@angular/core';
import { TaskComponent } from "../task/task";

@Component({
  selector: 'app-task-container',
  imports: [
    TaskComponent
  ],
  templateUrl: './task-container.html',
  styleUrl: './task-container.scss',
})
export class TaskContainerComponent {
  
}
