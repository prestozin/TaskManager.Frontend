import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  imports: [],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})

export class DatePickerComponent {

  label = input<string>('');

  selectedDate = input<string | null>(null);

  dateSelected = output<string | null>();


  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.dateSelected.emit(
      input.value || null
    );
  }
}
