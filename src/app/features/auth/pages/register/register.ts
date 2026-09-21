import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../../../layouts/auth-layout/auth-layout';
import { InputFormsComponent } from '../../../../shared/components/input-forms/input-forms';


import { RegisterRequest } from '../../models/auth.models';
import { AuthFacade } from '@features/auth/facades/auth.facade';

@Component({
  selector: 'app-register',
  imports: [
    AuthLayoutComponent,
    ReactiveFormsModule,
    InputFormsComponent,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private readonly authFacade = inject(AuthFacade);

  readonly isLoading = this.authFacade.isLoading;
  readonly successMessage = this.authFacade.successMessage;
  readonly errorMessage = this.authFacade.errorMessage;

  registerForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  }, {
    validators: form => this.passwordsMatch(form)
  });

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request: RegisterRequest = this.registerForm.getRawValue();

    this.authFacade.register(request);
  }

  passwordsMatch(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword)
      return { passwordsMismatch: true };

    return null;
  }
}