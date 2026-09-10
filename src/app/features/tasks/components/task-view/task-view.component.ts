import { Component, input } from '@angular/core';
import { TaskResponse } from '@features/tasks/models/task.models';

@Component({
  selector: 'app-task-view',
  imports: [],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {

  task = input.required<TaskResponse>();
}
