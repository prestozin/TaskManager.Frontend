import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';


@Component({
  selector: 'app-profile',
  imports: [
    MainLayoutComponent,
    InputFormsComponent,
    ReactiveFormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    role: new FormControl('', { nonNullable: true }),
    area: new FormControl('', { nonNullable: true }),
    about: new FormControl('', { nonNullable: true })
  });

}