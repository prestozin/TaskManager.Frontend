import { Component, inject, input, output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskFacade } from '@features/tasks/facades/task.facade';
import { TaskCreateRequest, TaskEditRequest, TaskResponse } from '@features/tasks/models/task.models';
import { DropdownComponent } from '@shared/components/dropdown/dropdown';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { SelectableOption } from '@shared/models/selectables.models';

@Component({
  selector: 'app-task-form',
  imports: [
    InputFormsComponent,
    DropdownComponent
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})

export class TaskFormComponent {

  private taskFacade = inject(TaskFacade);

  taskForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  priorityOptions = this.taskFacade.priorityOptions;
  statusOptions = this.taskFacade.statusOptions;

  selectedPriority: SelectableOption | null = null;
  selectedStatus: SelectableOption | null = null;

  cancelClicked = output();
  taskSaved = output<TaskCreateRequest | TaskEditRequest>();

  mode = input<'create' | 'edit'>('create');
  task = input<TaskResponse | null>(null);

  submitTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    if (this.selectedPriority?.id == null || this.selectedStatus?.id == null) {
      return;
    }

    const formValue = this.taskForm.getRawValue();

    if (this.mode() === 'create') {
      const request: TaskCreateRequest = {
        title: formValue.titulo,
        description: formValue.descricao,
        statusId: this.selectedStatus.id!,
        priorityId: this.selectedPriority.id!
      };

      this.taskSaved.emit(request);
      return;
    }

    const currentTask = this.task();

    if (!currentTask) return;

    const request: TaskEditRequest = {
      id: currentTask.id,
      title: formValue.titulo,
      description: formValue.descricao,
      statusId: this.selectedStatus.id,
      priorityId: this.selectedPriority.id
    }
    this.taskSaved.emit(request);
  }

  cancelSubmit(): void {
    this.cancelClicked.emit();
  }

  selectPriority(priority: SelectableOption): void {
    this.selectedPriority = priority;
  }

  selectStatus(status: SelectableOption): void {
    this.selectedStatus = status;
  }

}
