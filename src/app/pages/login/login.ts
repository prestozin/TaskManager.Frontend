import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    AuthLayoutComponent,
    ReactiveFormsModule,
    PrimaryInput
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {

   private authService = inject(AuthService);
   
  loginForm = new FormGroup({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]})
  });

  submit() {
    console.log(this.loginForm.value) 
  }
}
