import { Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { TaskResponse } from '../../models/task.models';
import { normalizeClass, capitalizeFirst, truncateText } from '@shared/utils/string.util';
import { TASK_DESCRIPTION_PREVIEW_LENGTH } from '@shared/constants/constants';

@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {

  readonly normalizeClass = normalizeClass;
  readonly capitalizeFirst = capitalizeFirst;
  readonly truncateText = truncateText;

  task = input.required<TaskResponse>();

  optionsClicked = output<HTMLElement>();
  taskClicked = output<string>();

  checked = input(false);
  checkedChange = output<string>();

  taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });

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
