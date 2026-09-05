import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../../../../layouts/auth-layout/auth-layout";
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputFormsComponent } from '../../../../shared/components/input-forms/input-forms';
import { AuthFacade } from '../../facades/auth.facade';
import { RegisterRequest } from '../../models/auth.models';


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

  private cdr = inject(ChangeDetectorRef);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  registerForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  },
    { validators: (form) => this.passwordsMatch(form) });

  submit(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const request: RegisterRequest = this.registerForm.getRawValue();

    this.authFacade.register(request).subscribe({

      next: (response) => {

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);

        this.errorMessage = '';
        this.successMessage = response.message;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },

      error: (error) => {

        this.isLoading = false;
        this.successMessage = '';
        this.errorMessage = error.error.message ?? 'Erro ao realizar cadastro.';

        this.cdr.detectChanges();
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
