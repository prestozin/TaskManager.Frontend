import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../../components/auth-layout/auth-layout";
import { InputFormsComponent } from '../../components/input-forms/input-forms';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

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

  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  },
    { validators: (form) => this.passwordsMatch(form) });

  submit() {
    console.log('SUBMIT CHAMADO');
    if (this.registerForm.invalid) {
      console.log('FORM INVALIDO');
      this.registerForm.markAllAsTouched();

      return;
    }
    console.log('FORM VALIDO');
    const { email, password, name } = this.registerForm.getRawValue();

    this.authService.register(email, password, name).subscribe({

      next: (response) => {
        console.log('RESPOSTA API:', response)
        this.successMessage = response.message; console.log('MENSAGEM:', this.successMessage);
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },

      error: (error) => {
        console.log('ERRO API:', error);
        console.log('MENSAGEM DO BACK:', error.error?.message);

        this.errorMessage = error.error.message;
        this.successMessage = ''; console.log('SUBMIT MESSAGE:', this.errorMessage);
      }

    })
  }

  passwordsMatch(form: AbstractControl) {

    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword)
      return { passwordsMismatch: true };

    return null;
  }
}
