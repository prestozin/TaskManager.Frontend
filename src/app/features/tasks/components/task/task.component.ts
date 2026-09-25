import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { TASK_DESCRIPTION_PREVIEW_LENGTH } from '@shared/constants/constants';
import { capitalizeFirst, normalizeClass, truncateText } from '@shared/utils/string.util';

import { TaskResponse } from '../../models/task.models';

@Component({
  selector: 'app-task',
  imports: [
    DatePipe,
    NgClass,
    NzCheckboxModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {

  readonly normalizeClass = normalizeClass;
  readonly capitalizeFirst = capitalizeFirst;
  readonly truncateText = truncateText;

  task = input.required<TaskResponse>();

  checked = input(false);

  showCheckbox = input(true);
  showOptions = input(true);

  optionsClicked = output<HTMLElement>();
  taskClicked = output<string>();
  checkedChange = output<string>();

  readonly title = computed(() =>
    capitalizeFirst(this.task().title)
  );

  readonly description = computed(() =>
    truncateText(
      capitalizeFirst(this.task().description),
      TASK_DESCRIPTION_PREVIEW_LENGTH
    )
  );

}