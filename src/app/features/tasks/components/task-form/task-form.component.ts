import { Component, computed, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { SelectableOption } from '@shared/models/selectables.models';

import { TaskCreateRequest, TaskEditRequest, TaskResponse } from '../../models/task.models';

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule,
    InputFormsComponent,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {

  taskForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  formTitle = computed(() =>
    this.mode() === 'create' ? 'Adicionar nova tarefa' : 'Editar tarefa');

  formSubtitle = computed(() =>
    this.mode() === 'create' ? 'Preencha as informações da nova tarefa' : 'Altere as informações da tarefa');

  submitText = computed(() =>
    this.mode() === 'create' ? 'Criar' : 'Salvar alterações');

  priorityOptions = input.required<SelectableOption[]>();
  statusOptions = input.required<SelectableOption[]>();

  mode = input<'create' | 'edit'>('create');
  task = input<TaskResponse | null>(null);
  isLoading = input(false);

  readonly selectedPriority = signal<SelectableOption | null>(null);
  readonly selectedStatus = signal<SelectableOption | null>(null);

  readonly selectedPriorityId = computed(() =>
    this.selectedPriority()?.id ?? null
  );

  readonly selectedStatusId = computed(() =>
    this.selectedStatus()?.id ?? null
  );

  cancelClicked = output();
  submitClicked = output<TaskCreateRequest | TaskEditRequest>();

  ngOnInit(): void {
    const task = this.task();

    if (this.mode() === 'edit' && task) {
      this.taskForm.patchValue({
        titulo: task.title,
        descricao: task.description
      });

      this.selectedPriority.set(
        this.priorityOptions().find(option => option.name === task.priority) ?? null
      );

      this.selectedStatus.set(
        this.statusOptions().find(option => option.name === task.status) ?? null
      );

      return;
    }

    this.selectedPriority.set(
      this.priorityOptions()[0] ?? null
    );

    this.selectedStatus.set(
      this.statusOptions()[0] ?? null
    );
  }

  submitTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const selectedPriority = this.selectedPriority();
    const selectedStatus = this.selectedStatus();

    if (selectedPriority?.id == null || selectedStatus?.id == null) {
      return;
    }

    const formValue = this.taskForm.getRawValue();

    if (this.mode() === 'create') {
      const request: TaskCreateRequest = {
        title: formValue.titulo,
        description: formValue.descricao,
        statusId: selectedStatus.id,
        priorityId: selectedPriority.id
      };

      this.submitClicked.emit(request);
      return;
    }

    const currentTask = this.task();

    if (!currentTask) {
      return;
    }

    const request: TaskEditRequest = {
      id: currentTask.id,
      title: formValue.titulo,
      description: formValue.descricao,
      statusId: selectedStatus.id,
      priorityId: selectedPriority.id
    };

    this.submitClicked.emit(request);
  }

  cancelSubmit(): void {
    this.cancelClicked.emit();
  }

  selectPriorityById(id: number | null): void {
    const priority = this.priorityOptions()
      .find(option => option.id === id);

    if (!priority) {
      return;
    }

    this.selectedPriority.set(priority);
  }

  selectStatusById(id: number | null): void {
    const status = this.statusOptions()
      .find(option => option.id === id);

    if (!status) {
      return;
    }

    this.selectedStatus.set(status);
  }
}