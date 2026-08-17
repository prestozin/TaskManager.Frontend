import { Component } from '@angular/core';
import { AuthLayoutComponent } from "../../components/auth-layout/auth-layout";
import { InputFormsComponent } from '../../components/input-forms/input-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  registerForm = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]}),
    confirmPassword: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]})
  });

  submit() {
    console.log(this.registerForm.value) 
  }
}
