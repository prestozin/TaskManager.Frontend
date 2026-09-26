import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { getFormControlErrorMessage } from '@shared/utils/form-error.util';

type InputType = 'text' | 'email' | 'password' | 'textarea';

@Component({
  selector: 'app-input-forms',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './input-forms.html',
  styleUrl: './input-forms.scss'
})
export class InputFormsComponent {

  readonly control = input.required<FormControl>();
  readonly type = input<InputType>('text');
  readonly placeholder = input('');
  readonly maxLength = input<number | null>(null);

  readonly isTextarea = computed(() =>
    this.type() === 'textarea'
  );

  get isInvalid(): boolean {
    const control = this.control();

    return control.invalid && control.touched;
  }

  get errorMessage(): string | null {
    return getFormControlErrorMessage(this.control());
  }
}
