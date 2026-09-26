import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthFacade } from '@features/auth/facades/auth.facade';
import { LoginRequest } from '@features/auth/models/auth.models';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/constants';

@Component({
  selector: 'app-login',
  imports: [
    AuthLayoutComponent,
    InputFormsComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  private readonly authFacade = inject(AuthFacade);

  readonly isLoading = this.authFacade.isLoading;
  readonly successMessage = this.authFacade.successMessage;
  readonly errorMessage = this.authFacade.errorMessage;

  readonly loginForm = new FormGroup({
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
    })
  });

  ngOnInit(): void {
    this.authFacade.clearMessages();
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request: LoginRequest = this.loginForm.getRawValue();

    this.authFacade.login(request);
  }
}
