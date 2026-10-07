import { Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { getFormControlErrorMessage } from '@shared/utils/form-error/form-error.util';
import { NzIconModule } from 'ng-zorro-antd/icon';

type InputType = 'text' | 'email' | 'password' | 'textarea';

@Component({
  selector: 'app-input-forms',
  imports: [
    ReactiveFormsModule,
    NzIconModule
  ],
  templateUrl: './input-forms.html',
  styleUrl: './input-forms.scss'
})
export class InputFormsComponent {

  readonly control = input.required<FormControl>();
  readonly type = input<InputType>('text');
  readonly placeholder = input('');
  readonly maxLength = input<number | null>(null);

  readonly isPasswordVisible = signal(false);


  get isInvalid(): boolean {
    const control = this.control();

    return control.invalid && control.touched;
  }

  get errorMessage(): string | null {
    return getFormControlErrorMessage(this.control());
  }

  readonly isTextarea = computed(() =>
    this.type() === 'textarea'
  );

  readonly inputType = computed(() => {
    if (this.type() !== 'password')
      return this.type();

    return this.isPasswordVisible() ? 'text' : 'password';
  });

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(visible => !visible);
  }
}
