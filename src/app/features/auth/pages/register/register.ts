import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthFacade } from '@features/auth/facades/auth.facade';
import { RegisterRequest } from '@features/auth/models/auth.models';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/constants';
import { Messages } from '@shared/constants/messages';

@Component({
  selector: 'app-register',
  imports: [
    AuthLayoutComponent,
    InputFormsComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {

  private readonly authFacade = inject(AuthFacade);

  readonly isLoading = this.authFacade.isLoading;
  readonly successMessage = this.authFacade.successMessage;
  readonly errorMessage = this.authFacade.errorMessage;

  readonly registerForm = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ]
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH)
        ]
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH)
        ]
      })
    },
    {
      validators: form => this.passwordsMatch(form)
    }
  );

  ngOnInit(): void {
    this.authFacade.clearMessages();
  }

  get passwordMismatchMessage(): string | null {
    const confirmPassword = this.registerForm.controls.confirmPassword;

    if (!confirmPassword.value || !confirmPassword.touched)
      return null;

    if (confirmPassword.hasError('minlength'))
      return null;

    return this.registerForm.hasError('passwordsMismatch')
      ? Messages.PasswordsDoNotMatch
      : null;
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request: RegisterRequest = this.registerForm.getRawValue();

    this.authFacade.register(request);
  }

  private passwordsMatch(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword)
      return { passwordsMismatch: true };

    return null;
  }
}
