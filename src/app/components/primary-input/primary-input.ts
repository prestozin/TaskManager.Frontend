import { Component, Input } from '@angular/core';
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

  @Input({ required: true })
  control!: FormControl;

  @Input()
  type: InputTypes = "text";

  @Input()
  placeholder: string = "";
  
}
