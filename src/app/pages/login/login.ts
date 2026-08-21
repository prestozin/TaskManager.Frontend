import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFormsComponent } from '../../components/input-forms/input-forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

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

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  submit() {

    if (this.loginForm.invalid)
      return;

    this.isLoading = true;

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (response) => {

        setTimeout(() => { this.isLoading = false;}, 1000);
        this.errorMessage = '';
        this.successMessage = response.message;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
      },

      error: (error) => {

        this.isLoading = false;
        this.successMessage = '';
        this.errorMessage = error.error.message;
        this.cdr.detectChanges();

      }
    });
  }

}
