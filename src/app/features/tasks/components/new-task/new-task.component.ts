import { Component, inject, output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskFacade } from '@features/tasks/facades/task.facade';
import { TaskCreateRequest } from '@features/tasks/models/task.models';
import { DropdownComponent } from '@shared/components/dropdown/dropdown';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { SelectableOption } from '@shared/models/selectables.models';

@Component({
  selector: 'app-new-task',
  imports: [
    InputFormsComponent,
    DropdownComponent
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss',
})

export class NewTaskComponent {

  private taskFacade = inject(TaskFacade);

  newTaskForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  priorityOptions = this.taskFacade.priorityOptions;
  statusOptions = this.taskFacade.statusOptions;

  selectedPriority: SelectableOption | null = null;
  selectedStatus: SelectableOption | null = null;

  isPriorityDropdownOpen = false;

  cancelClicked = output();
  taskCreated = output<TaskCreateRequest>();

  createNewTask(): void {
    if (this.newTaskForm.invalid) {
      this.newTaskForm.markAllAsTouched();
      return;
    }

    if (this.selectedPriority?.id == null || this.selectedStatus?.id == null) {
      return;
    }

    const formValue = this.newTaskForm.getRawValue();

    const newTask: TaskCreateRequest = {
      title: formValue.titulo,
      description: formValue.descricao,
      statusId: this.selectedStatus.id!,
      priorityId: this.selectedPriority.id!
    };

    this.taskCreated.emit(newTask);
  }

  cancelNewTask(): void {
    this.cancelClicked.emit();
  }

  selectPriority(priority: SelectableOption): void {
    this.selectedPriority = priority;
  }

  selectStatus(status: SelectableOption): void {
    this.selectedStatus = status;
  }

}
