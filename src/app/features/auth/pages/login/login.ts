import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../../../layouts/auth-layout/auth-layout';
import { InputFormsComponent } from '../../../../shared/components/input-forms/input-forms';

import { LoginRequest } from '../../models/auth.models';
import { AuthFacade } from '@features/auth/facades/auth.facade';

@Component({
  selector: 'app-login',
  imports: [
    AuthLayoutComponent,
    ReactiveFormsModule,
    InputFormsComponent,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly authFacade = inject(AuthFacade);

  readonly isLoading = this.authFacade.isLoading;
  readonly successMessage = this.authFacade.successMessage;
  readonly errorMessage = this.authFacade.errorMessage;

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required,Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(6)]
    })
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    const request: LoginRequest = this.loginForm.getRawValue();

    this.authFacade.login(request);
  }
}