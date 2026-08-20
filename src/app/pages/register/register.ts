import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../../components/auth-layout/auth-layout";
import { InputFormsComponent } from '../../components/input-forms/input-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  submit() {

    if (this.registerForm.invalid)
      return;

    const { email, password, name } = this.registerForm.getRawValue();

    this.authService.register(email, password, name).subscribe({

      next: (response) => { this.router.navigate(['/login']); },
      error: (error) => { console.error('Erro ao fazer cadastro:', error); }

    })
  }
}
