import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH
} from '@shared/constants/constants';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { SelectableOption } from '@shared/models/selectables.models';

import { ETaskFormMode } from '../../enums/task.enum';
import {
  TaskCreateRequest,
  TaskEditRequest,
  TaskResponse
} from '../../models/task.models';

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule,
    InputFormsComponent,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  readonly priorityOptions = input.required<SelectableOption[]>();
  readonly statusOptions = input.required<SelectableOption[]>();

  readonly mode = input<ETaskFormMode>(ETaskFormMode.Create);
  readonly task = input<TaskResponse | null>(null);
  readonly isLoading = input(false);

  readonly cancelClicked = output<void>();
  readonly submitClicked = output<TaskCreateRequest | TaskEditRequest>();

  readonly selectedPriority = signal<SelectableOption | null>(null);
  readonly selectedStatus = signal<SelectableOption | null>(null);

  readonly taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(TASK_TITLE_MIN_LENGTH),
        Validators.maxLength(TASK_TITLE_MAX_LENGTH)
      ]
    }),

    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(TASK_DESCRIPTION_MAX_LENGTH)
      ]
    })
  });

  readonly formTitle = computed(() =>
    this.mode() === ETaskFormMode.Create
      ? 'Adicionar nova tarefa'
      : 'Editar tarefa'
  );

  readonly formSubtitle = computed(() =>
    this.mode() === ETaskFormMode.Create
      ? 'Preencha as informações da nova tarefa'
      : 'Altere as informações da tarefa'
  );

  readonly submitText = computed(() =>
    this.mode() === ETaskFormMode.Create
      ? 'Criar'
      : 'Salvar alterações'
  );

  readonly selectedPriorityId = computed(() =>
    this.selectedPriority()?.id ?? null
  );

  readonly selectedStatusId = computed(() =>
    this.selectedStatus()?.id ?? null
  );

  readonly titleMaxLength = TASK_TITLE_MAX_LENGTH;
  readonly descriptionMaxLength = TASK_DESCRIPTION_MAX_LENGTH;

  ngOnInit(): void {
    const task = this.task();

    if (this.mode() === ETaskFormMode.Edit && task) {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description
      });

      this.selectedPriority.set(
        this.priorityOptions().find(option => option.name === task.priority) ?? null
      );

      this.selectedStatus.set(
        this.statusOptions().find(option => option.name === task.status) ?? null
      );

      return;
    }

    this.selectedPriority.set(this.priorityOptions()[0] ?? null);
    this.selectedStatus.set(this.statusOptions()[0] ?? null);
  }

  submitTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const selectedPriority = this.selectedPriority();
    const selectedStatus = this.selectedStatus();

    if (!selectedPriority || !selectedStatus)
      return;

    const formValue = this.taskForm.getRawValue();

    if (this.mode() === ETaskFormMode.Create) {
      this.submitClicked.emit({
        title: formValue.title,
        description: formValue.description,
        statusId: selectedStatus.id,
        priorityId: selectedPriority.id
      });

      return;
    }

    const currentTask = this.task();

    if (!currentTask)
      return;

    this.submitClicked.emit({
      id: currentTask.id,
      title: formValue.title,
      description: formValue.description,
      statusId: selectedStatus.id,
      priorityId: selectedPriority.id
    });
  }

  cancelSubmit(): void {
    this.cancelClicked.emit();
  }

  selectPriorityById(id: number | null): void {
    if (id === null)
      return;

    const priority = this.priorityOptions()
      .find(option => option.id === id);

    if (!priority)
      return;

    this.selectedPriority.set(priority);
  }

  selectStatusById(id: number | null): void {
    if (id === null)
      return;

    const status = this.statusOptions()
      .find(option => option.id === id);

    if (!status)
      return;

    this.selectedStatus.set(status);
  }
}
