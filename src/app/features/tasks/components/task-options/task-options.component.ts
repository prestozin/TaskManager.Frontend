import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-options',
  templateUrl: './task-options.component.html',
  styleUrl: './task-options.component.scss'
})
export class TaskOptionsComponent {

  position = input.required<{ top: number; right: number; }>();
  
  deleteTaskClicked = output<void>();
  editTaskClicked = output<void>();

  closeClicked = output<void>();
}