import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFormsComponent } from '../../components/input-forms/input-forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../facades/auth/auth.facade';
import { LoginRequest } from '../../interfaces/auth/login-request';

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

  private authFacade = inject(AuthFacade);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  submit(): void {

    if (this.loginForm.invalid)
      return;

    this.isLoading = true;

    const request: LoginRequest = this.loginForm.getRawValue();

    this.authFacade.login(request).subscribe({
      next: (response) => {

        this.errorMessage = '';
        this.successMessage = response.message;

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);

        this.cdr.detectChanges();

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        this.isLoading = false;
        this.successMessage = '';

        this.errorMessage = error.error?.message ?? 'Erro ao realizar login.';

        this.cdr.detectChanges();
      }
    });
  }
}


