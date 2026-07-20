import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

type InputTypes = "text" | "email" | "password"

@Component({
  selector: 'app-primary-input',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './primary-input.html',
  styleUrl: './primary-input.scss',
})

export class PrimaryInput {

  control = input.required<FormControl>() ;

  type = input<InputTypes>('text');

  placeholder = input<string>('');
   
}
