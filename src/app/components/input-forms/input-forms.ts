import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

type InputTypes = "text" | "email" | "password" | 'textarea';

@Component({
  selector: 'app-input-forms',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './input-forms.html',
  styleUrl: './input-forms.scss',
})

export class InputFormsComponent {
  
  control = input.required<FormControl>() ;

  type = input<InputTypes>('text');

  placeholder = input<string>('');
   
}
