import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { LoadingButtonComponent } from '@shared/components/loading-button/loading-button.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  imports: [
    MainLayoutComponent,
    InputFormsComponent,
    ReactiveFormsModule,
    LoadingButtonComponent,
    DatePipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  private readonly profileFacade = inject(ProfileFacade)

  readonly profile = this.profileFacade.profile;
  readonly isLoading = this.profileFacade.isLoading;


  readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    role: new FormControl('', { nonNullable: true }),
    area: new FormControl('', { nonNullable: true }),
    about: new FormControl('', { nonNullable: true })
  });

  private readonly profileEffect = effect(() => {
    const profile = this.profile();

    if (!profile) return;

    this.profileForm.patchValue({
      name: profile.name,
      role: profile.role ?? '',
      area: profile.area ?? '',
      about: profile.about ?? ''
    });
  });

  

  ngOnInit(): void {
    this.profileFacade.loadProfile();
  }


  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
  }
}