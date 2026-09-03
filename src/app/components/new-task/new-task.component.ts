import { Component, inject, output } from '@angular/core';
import { InputFormsComponent } from '../input-forms/input-forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown';
import { SelectableOption } from '../../interfaces/selectable-option';
import { TaskFacade } from '../../facades/task.facade';

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


  cancelNewTask() {
    this.cancelClicked.emit();
  }

  selectPriority(priority: SelectableOption): void {
    this.selectedPriority = priority;
  }

  selectStatus(status: SelectableOption): void {
    this.selectedStatus = status;
  }

}
