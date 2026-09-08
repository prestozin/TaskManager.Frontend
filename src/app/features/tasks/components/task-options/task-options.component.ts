import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-options',
  templateUrl: './task-options.component.html',
  styleUrl: './task-options.component.scss'
})
export class TaskOptionsComponent {

  taskId = input.required<string>();
  position = input.required<{ top: number; right: number; }>();
  deleteClicked = output<string>();

  closeClicked = output<void>();
}