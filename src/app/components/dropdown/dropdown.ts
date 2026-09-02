import { Component, input, output } from '@angular/core';
import { SelectableOption } from '../../interfaces/selectable-option';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class DropdownComponent {

  label = input<string>('');
  placeholder = input<string>('Selecione uma opção');

  options = input.required<SelectableOption[]>();
  selectedOption = input<SelectableOption | null>(null);

  optionSelected = output<SelectableOption>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: SelectableOption): void {
    this.optionSelected.emit(option);
    this.isOpen = false;
  }
}
