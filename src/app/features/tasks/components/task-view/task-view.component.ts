import { DatePipe, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TaskResponse } from '@features/tasks/models/task.models';
import { normalizeClass, capitalizeFirst, truncateText } from '@shared/utils/string.util';

@Component({
  selector: 'app-task-view',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {

  readonly normalizeClass = normalizeClass;
  readonly capitalizeFirst = capitalizeFirst;
  readonly truncateText = truncateText;

  task = input.required<TaskResponse>();

  deleteTaskClicked = output<void>();
  editTaskClicked = output<void>();
  closeClicked = output<void>();


}
