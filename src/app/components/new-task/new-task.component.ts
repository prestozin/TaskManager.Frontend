import { Component, output } from '@angular/core';
import { InputFormsComponent } from '../input-forms/input-forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown';

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
  newTaskForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  priorities = [{ id: 1, name: 'Baixa' },
  { id: 2, name: 'Média' },
  { id: 3, name: 'Alta' }
  ];

  selectedPriority = this.priorities[2];

  isPriorityDropdownOpen = false;

  cancelClicked = output();

  cancelNewTask() {
    this.cancelClicked.emit();
  }

  selectPriority(priority: DropdownOption): void {
    this.selectedPriority = priority;
  }

}
