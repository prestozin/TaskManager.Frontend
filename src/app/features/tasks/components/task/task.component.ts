import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { capitalizeFirst, normalizeClass, truncateText } from '@shared/utils/string/string.util';

import { TaskResponse } from '../../models/task.models';
import { TASK_DESCRIPTION_PREVIEW_LENGTH } from '@shared/constants/constants';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-task',
  imports: [
    DatePipe,
    NgClass,
    NzCheckboxModule,
    NzIconModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  readonly task = input.required<TaskResponse>();

  readonly checked = input(false);
  readonly showCheckbox = input(true);
  readonly showOptions = input(true);

  readonly optionsClicked = output<HTMLElement>();
  readonly taskClicked = output<string>();
  readonly checkedChange = output<string>();

  readonly withoutCheckbox = computed(() =>
    !this.showCheckbox()
  );

  readonly withoutOptions = computed(() =>
    !this.showOptions()
  );

  readonly title = computed(() =>
    capitalizeFirst(this.task().title)
  );

  readonly description = computed(() =>
    truncateText(capitalizeFirst(this.task().description), TASK_DESCRIPTION_PREVIEW_LENGTH)
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
