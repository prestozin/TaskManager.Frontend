import { Component, input, output } from '@angular/core';

export interface DropdownOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class DropdownComponent {

  label = input<string>('');
  placeholder = input<string>('Selecione uma opção');

  options = input.required<DropdownOption[]>();
  selectedOption = input<DropdownOption | null>(null);

  optionSelected = output<DropdownOption>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption) {
    this.optionSelected.emit(option);
    this.isOpen = false;
  }
}
