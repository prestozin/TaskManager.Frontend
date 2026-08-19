import { Component, inject } from '@angular/core';
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

  loginForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  submit() {

    if (this.loginForm.invalid)
      return;

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (response) => {

        console.log('Login realizado!');

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error(
          'Erro ao realizar login:',
          error
        );
      }
    });
  }
}
