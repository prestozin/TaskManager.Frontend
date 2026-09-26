import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { TaskResponse } from '@features/tasks/models/task.models';
import { capitalizeFirst, normalizeClass } from '@shared/utils/string.util';

@Component({
  selector: 'app-task-view',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {

  readonly task = input.required<TaskResponse>();

  readonly deleteTaskClicked = output<void>();
  readonly editTaskClicked = output<void>();
  readonly closeClicked = output<void>();

  readonly title = computed(() =>
    capitalizeFirst(this.task().title)
  );

  readonly description = computed(() =>
    capitalizeFirst(this.task().description)
  );

  readonly priority = computed(() =>
    capitalizeFirst(this.task().priority)
  );

  readonly status = computed(() =>
    capitalizeFirst(this.task().status)
  );

  readonly priorityClass = computed(() =>
    `priority-${normalizeClass(this.task().priority)}`
  );

  readonly statusClass = computed(() =>
    `status-${normalizeClass(this.task().status)}`
  );
}
